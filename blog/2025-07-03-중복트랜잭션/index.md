---
slug: nexjs-cicd
title: NextJS 배포는 어떻게 하는게 좋을까?
authors:
  - haeyoung
tags:
  - infra
  - CICD
---
근데 서비스단에 transanction 박았는데 저렇게 쿼리에 트랜잯션처리 되있어도 괜찮아?

###### ChatGPT의 말:

해영님, 정말 좋은 질문이에요! 👍  
서비스에 `@Transactional`을 걸어두고, 쿼리 안에 `BEGIN TRAN … COMMIT`을 또 작성하는 게 적절한가? → 결론부터 말씀드리면:

✅ **비추천이고, 지양하는 게 맞습니다.**

---

### 📌 이유: 트랜잭션 충돌 & 관리 불일치

- Spring + MyBatis + DBMS는 각자 트랜잭션을 관리합니다.
    
- `@Transactional`은 **Spring의 트랜잭션 매니저**가 Connection의 autoCommit을 꺼두고 작업을 하나의 트랜잭션으로 묶어 관리합니다.
    
- 그런데 SQL 쿼리 안에서 또 `BEGIN TRAN … COMMIT`을 쓰면, **DBMS에서 별도의 트랜잭션을 강제로 생성**합니다.
    
    - 이 경우 Spring 트랜잭션과 DBMS 트랜잭션이 따로 놀게 됩니다.
        
    - 예) Spring에서 롤백을 하더라도, 쿼리에서 `COMMIT`을 해버렸기 때문에 이미 DB에 반영돼 버림.
        

---

### 🧹 권장 패턴

✅ **하나만 유지하세요.**

- DB에선 쿼리만: `UPDATE`, `INSERT`, `DELETE` 쿼리만 작성
    
- 트랜잭션 관리: Spring `@Transactional`로 전담
    

즉, 아래처럼 바꾸는 게 좋아요:


`<update id="updateUnpaidCostAndHistory">     UPDATE Parking_Unpaid_UnpaidHistory     SET finalCost = #{finalCost}     WHERE ticketNo = #{ticketNo};      UPDATE vacs_vact     SET tr_amt = #{finalCost}     WHERE acct_no = (         SELECT virtualAccount         FROM Parking_Unpaid_UnpaidHistory         WHERE ticketNo = #{ticketNo}     )     AND org_cd = '20005080';      INSERT INTO Parking_Unpaid_ModifyHistory(         ticketNo, agoHistory, modifyParkCode, modifyMan     )     VALUES(         #{ticketNo}, #{agoHistory}, #{modifyParkCode}, #{modifyMan}     ); </update>`

그리고 서비스단에서:

`@Transactional public void modifyUnpaid(UnpaidCostModifyDto dto) {     mapper.updateUnpaidCostAndHistory(dto); }`

---

### 🚨 만약 정말 DB에만 의존해야 하는 이유가 있다면?

- Spring이 없는 순수 DB 작업이라면 쿼리에서 `BEGIN … COMMIT`을 써야죠.
    
- 하지만 Spring 기반 프로젝트라면 쿼리에서 트랜잭션은 빼는 게 좋습니다.
    

---

### 정리

✅ Spring 기반 → 서비스단 `@Transactional`  
❌ SQL 안에 `BEGIN TRAN … COMMIT`

이렇게 하시면 깔끔하고 관리도 쉽고 rollback도 잘 작동합니다.  
혹시 더 깊이 들어가서 “왜 DB 레벨과 Spring 트랜잭션이 충돌하는지” 궁금하시다면 추가로 설명해 드릴게요! 🙌

##### 나의 말:

그럼 mybatis+DB 트랜잭션과 스프링기반 트랜잭션이 충돌한다고 이해하면되나? 아니면 트랜잭션이 각각 3개 생걱되는건가?

###### ChatGPT의 말:

해영님, 아주 핵심을 찌르셨어요! 🌟  
질문에 답하면서 정확히 짚어 드리겠습니다.

---

### 💡 질문 요약

- MyBatis + DB 트랜잭션 + Spring 트랜잭션이 _충돌_하나요?
    
- 아니면 각각 따로 3개의 트랜잭션이 생기나요?
    

---

### 📌 현실적으로는 **DB 안에서는 트랜잭션은 하나만 생깁니다.**

하지만 **관리 주체가 달라서 서로 간섭/혼란이 발생**하는 것이 핵심이에요.

---

## 🎯 구조를 이해하자

#### 1️⃣ DB 트랜잭션

- DBMS가 제공하는 “트랜잭션”은 하나.
    
- `BEGIN TRAN … COMMIT`으로 DB 안에서 트랜잭션을 명시적으로 시작하고 끝냄.
    

#### 2️⃣ MyBatis

- MyBatis는 JDBC `Connection`을 통해 트랜잭션을 시작합니다.
    
- `sqlSessionFactory.openSession()` 시 `autoCommit=false`라면 트랜잭션을 묶고 `commit()`/`rollback()` 호출해야 함.
    
- 따라서 MyBatis 단독으로 사용할 때는 DB 트랜잭션을 MyBatis가 관리하는 형태입니다.
    

#### 3️⃣ Spring

- Spring은 `DataSourceTransactionManager`가 JDBC `Connection`을 가져와서 `setAutoCommit(false)` 하고 트랜잭션을 묶습니다.
    
- 그리고 `@Transactional` 끝날 때 `commit()`/`rollback()`.
    

---

## 🚨 문제가 되는 이유

DB는 트랜잭션이 하나인데,  
**Spring과 MyBatis가 동시에 그 트랜잭션을 제어하려고 하면 혼란이 발생합니다.**

예를 들어:

- Spring 트랜잭션이 시작돼 `autoCommit=false` 상태에서 Connection을 전달.
    
- 그런데 MyBatis의 쿼리가 내부적으로 `BEGIN TRAN … COMMIT`을 실행해 버리면,  
    Spring이 관리하는 트랜잭션이 중간에 DB 레벨에서 Commit돼 버립니다.
    
- 이 상태에서 Spring이 `rollback()`을 호출해도 이미 DB에는 반영돼 버린 상태라 rollback이 안 됩니다.
    

---

## 🧹 정리

✅ DB에는 트랜잭션이 **하나만 생깁니다.**  
하지만 그 하나를 관리하는 주체가 Spring ↔ MyBatis ↔ DB SQL 로직이 서로 중복되어 관리 충돌을 일으킵니다.  
이를 **트랜잭션 일관성 문제**라고 표현합니다.

---

## 🔷 Best Practice

- 트랜잭션 관리 주체를 **Spring으로 통일.**
    
- MyBatis는 SQL만 작성. 트랜잭션은 신경쓰지 않음.
    
- SQL에는 `BEGIN TRAN … COMMIT`을 쓰지 않는다.
    

---

### 요약

🧭 _“DB에는 하나의 트랜잭션만 있지만, 관리 주체가 2~3군데 되면 충돌이 난다”_  
그러니 MyBatis와 SQL에서는 트랜잭션 코드를 없애고, `@Transactional`로 통일하는 게 맞습니다.

---

혹시 더 궁금하시다면 **Connection 풀과 트랜잭션 동작 순서**까지도 단계별로 설명드릴게요! 🚀  
언제든 말씀해 주세요 해영님 🙌

##### 나의 말:

그니깐 이경우에는 트랜잭션이 어떻게 생기냐고

###### ChatGPT의 말:

👍 해영님, 이 경우 _정확히 “어디서 트랜잭션이 생성되는지”_ 단계별로 말씀드릴게요!  
(질문: “Spring @Transactional + MyBatis + SQL의 BEGIN TRAN … COMMIT” 같이 섞여 있을 때 트랜잭션이 어떻게 생기냐”)

---

## 🪄 상황 요약

- 서비스 메서드에 `@Transactional`이 붙어 있음
    
- MyBatis를 통해 SQL 실행
    
- SQL 내부에 `BEGIN TRAN … COMMIT`도 들어가 있음
    

---

## 🎯 트랜잭션 생명 주기

### 1️⃣ **Spring**

- `@Transactional` 진입 → `DataSource.getConnection()` 호출
    
- 이때 Connection은 풀에서 꺼내오고, `setAutoCommit(false)`로 변경
    
- JDBC Connection 레벨에서 트랜잭션이 시작됨
    
- Spring이 관리하는 트랜잭션이 **1개 생김** (DB에는 아직 아무것도 커밋되지 않음)
    

---

### 2️⃣ **MyBatis**

- Spring이 열어둔 Connection을 MyBatis가 사용
    
- MyBatis는 `autoCommit=false` 상태인 Connection을 그대로 사용
    
- MyBatis가 SQL 실행 시 별도로 트랜잭션을 시작하지 않음
    
- 여기까지는 트랜잭션은 **Spring이 하나만 관리**
    

---

### 3️⃣ **SQL 내부 BEGIN TRAN … COMMIT**

- SQL 안에 `BEGIN TRAN … COMMIT`이 있으면?
    
- DBMS 레벨에서 또 하나의 트랜잭션이 열린 것처럼 보이지만…
    
- 사실은 같은 JDBC Connection 안에서 **트랜잭션을 덮어쓰기**하거나, 오히려 즉시 `COMMIT` 해버려서 Spring 관리 트랜잭션이 깨짐
    

---

## 💥 결과

|주체|트랜잭션|
|---|---|
|Spring|1개|
|MyBatis|없음 (Spring 걸 사용)|
|SQL 내부|DB에 강제로 Commit (Spring이 모르는 상태)|

즉, 물리적으로 DB에는 **트랜잭션이 하나만 생기지만**,  
Spring이 관리하던 트랜잭션이 중간에 Commit돼 버려서 Spring이 rollback 하더라도 이미 DB에는 반영돼 있는 상태가 됩니다.

---

## 🔷 요약

✅ 트랜잭션은 물리적으로는 항상 **하나**  
🚨 그런데 SQL에 `BEGIN TRAN … COMMIT`이 있으면 Spring 관리 트랜잭션이 무력화됨  
🎯 _Spring 관리에 맡기고 SQL에서는 BEGIN/COMMIT을 절대 쓰지 않는 것_이 중요

---

혹시 “DB 로그 상에서 정확히 트랜잭션 id가 몇 개로 찍히는지”까지도 확인해 보고 싶다면 방법도 알려드릴게요!  
이해가 잘 되셨는지 궁금합니다, 더 필요하면 예제 코드로도 설명드릴게요 해영님! 🌸