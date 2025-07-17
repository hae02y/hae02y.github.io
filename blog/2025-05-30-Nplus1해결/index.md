---
slug: jpa-problem
title: N+1 문제 해결
authors:
  - haeyoung
tags:
  - Java
  - spring
  - payment
---
실무에서 `N+1`가 발생하여 해결했던 경험에 대해서 작성해보고자 한다.

### N+1 이란?

N+1 문제는 데이터를 1번의 Query로 조회한 후, 각 데이터의 연관된 데이터를 추가로 N번 Query 하는 비효율적인 데이터 조회 패턴이다. 보통 연관관계에서 주로 발생하게 되고, 코드 설계에 따라 `for`문  등을 돌면서 발생가능하다.

예를 들어 아래와 같은 코드가 있다고 가정해보자.
```java
@Entity

public class Post {

    @Id
    private Long id;

    private String title;

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    private List<Comment> comments;
}
```



### 문제있는 쿼리  
```sql
Hibernate: select ph1_0.ticketNo, ph1_0.approvalMethod, ph1_0.baseCost, ph1_0.bigo, ph1_0.carNo, ph1_0.carNo4Char, ph1_0.createDate, ph1_0.discountCode, ph1_0.finalCost, ph1_0.inBooth, ph1_0.inOutStatusCode, ph1_0.inTime, ph1_0.outBooth, ph1_0.outTime, ph1_0.parkAreaCode, ph1_0.parkingDay, ph1_0.sesuDay, ph1_0.sunnapCost, ph1_0.unpaidProcess, ph1_0.useOk, ph1_0.useTime from Parking_Dailypark_Parkinghistory ph1_0 where ph1_0.carNo4Char=? and ph1_0.inOutStatusCode=? and ph1_0.outTime is null 

Hibernate: select pa1_0.parkAreaCode, pa1_0.parkAreaName from Parking_Comm_ParkAreaMaster pa1_0 where pa1_0.parkAreaCode=? 

Hibernate: select pa1_0.parkAreaCode, pa1_0.parkAreaName from Parking_Comm_ParkAreaMaster pa1_0 where pa1_0.parkAreaCode=? 

Hibernate: select pa1_0.parkAreaCode, pa1_0.parkAreaName from Parking_Comm_ParkAreaMaster pa1_0 where pa1_0.parkAreaCode=? 

Hibernate: select pa1_0.parkAreaCode, pa1_0.parkAreaName from Parking_Comm_ParkAreaMaster pa1_0 where pa1_0.parkAreaCode=? 

Hibernate: select pa1_0.parkAreaCode, pa1_0.parkAreaName from Parking_Comm_ParkAreaMaster pa1_0 where pa1_0.parkAreaCode=? 

Hibernate: select pa1_0.parkAreaCode, pa1_0.parkAreaName from Parking_Comm_ParkAreaMaster pa1_0 where pa1_0.parkAreaCode=? 

Hibernate: select pa1_0.parkAreaCode, pa1_0.parkAreaName from Parking_Comm_ParkAreaMaster pa1_0 where pa1_0.parkAreaCode=? 

Hibernate: select pa1_0.parkAreaCode, pa1_0.parkAreaName from Parking_Comm_ParkAreaMaster pa1_0 where pa1_0.parkAreaCode=? 

Hibernate: select pa1_0.parkAreaCode, pa1_0.parkAreaName from Parking_Comm_ParkAreaMaster pa1_0 where pa1_0.parkAreaCode=? 

Hibernate: select pa1_0.parkAreaCode, pa1_0.parkAreaName from Parking_Comm_ParkAreaMaster pa1_0 where pa1_0.parkAreaCode=? 

Hibernate: select pa1_0.parkAreaCode, pa1_0.parkAreaName from Parking_Comm_ParkAreaMaster pa1_0 where pa1_0.parkAreaCode=? 

Hibernate: select pa1_0.parkAreaCode, pa1_0.parkAreaName from Parking_Comm_ParkAreaMaster pa1_0 where pa1_0.parkAreaCode=?
```


맞아요 해영님, 이건 **전형적인 N+1 문제**가 발생한 로그예요 😢

---

## 🔍 왜 N+1이 생겼을까?

`ParkingHistory` → `ParkAreaMaster`가 `@ManyToOne(fetch = FetchType.LAZY)` 로 매핑되어 있을 때,  
JPA는 ParkingHistory 목록을 먼저 쿼리한 후, 각 row마다 `getParkArea().getParkAreaName()` 같은 접근이 있을 때마다 **별도 쿼리로 parkArea 테이블을 조회**해요.

```java
// List<ParkingHistory> 조회 후 
for (ParkingHistory history : historyList) {     history.getParkArea().getParkAreaName(); // 여기서 parkAreaCode별로 쿼리 N번 발생! 
}
```

---

## ✅ 해결 방법: **Fetch Join** 사용

### 🔧 방법 1: QueryDSL fetchJoin 사용


```java
QParkingHistory ph = QParkingHistory.parkingHistory; 
QParkAreaMaster pa = QParkAreaMaster.parkAreaMaster;  
List<ParkingHistory> result = queryFactory     
	.selectFrom(ph)     
	.join(ph.parkArea, pa)
	.fetchJoin()     
	.where(ph.carNo4char.eq(carNum).and(ph.inOutStatusCode.eq((byte) 1))             .and(ph.outTime.isNull()))     
	.fetch();
```

이렇게 하면 ParkingHistory와 연관된 ParkArea를 **한 번의 조인 쿼리**로 가져오게 됩니다!

---

### 🔧 방법 2: `@EntityGraph` (JPA Repository 방식)

```java
@EntityGraph(attributePaths = {"parkArea"}) List<ParkingHistory> findByCarNo4charAndInOutStatusCodeAndOutTimeIsNull(...);
```

- 이것도 Lazy를 Eager처럼 만드는 트릭이에요.
- **쿼리 메서드로만 충분할 때** 아주 유용해요!

---

## 🧠 참고

- N+1 문제는 성능에 치명적이니 반드시 잡아야 해요.
- 특히 리스트 조회 API에서 연관 테이블 접근이 있다면 **fetch join이 필수**입니다.

---

해영님 방식에 맞춰서 QueryDSL이든 Repository 메서드든 바로 코드로 정리해드릴게요.  
원하시면 말만 해줘요, 바로 달려갑니다 😎🔥

##### 나의 말:
```java
public List<ParkingHistoryResponseDto> findInoutByCarNum(String carNum) { QParkingHistory carInfo = QParkingHistory.parkingHistory; BooleanExpression predicate = carInfo.carNo4char.eq(Short.valueOf(carNum)) .and(carInfo.inOutStatusCode.eq((byte) 1)) .and(carInfo.outTime.isNull()) ; Iterable<ParkingHistory> iterable = parkingHistoryRepository.findAll(predicate); return StreamSupport.stream(iterable.spliterator(), false) .map(ParkingHistoryMapper::CarInfoToCarInfoResponseDto) .collect(Collectors.toList()); } 
```
그럼 이쪽에서 문제가 되는건가?

###### ChatGPT의 말:

맞습니다 해영님, 지금 이 `findInoutByCarNum` 메서드에서 N+1 문제가 발생하는 **핵심 원인**이 바로 여기예요. 설명드릴게요!

---

## 💥 현재 문제 상황 요약

`parkingHistoryRepository.findAll(predicate)` →  `ParkingHistory` 목록만 조회
    
- `ParkingHistory`는 내부적으로 `@ManyToOne(fetch = LAZY)`로 `ParkAreaMaster`에 연결
    
- 이후 `ParkingHistoryMapper::CarInfoToCarInfoResponseDto` 에서 `history.getParkArea().getParkAreaName()` 등의 **연관 필드 접근**이 있을 경우
    
- 결과적으로 `ParkingHistory` 수만큼 `ParkAreaMaster` 조회 쿼리가 반복됨 → N+1 문제 발생
    

---

## ✅ 해결 방법: **QueryDSL에서 fetchJoin 사용하기**

아래처럼 `QueryDSL`로 `ParkingHistory`와 `ParkAreaMaster`를 조인해서 **한 번의 쿼리로 모두 가져오게** 하면 돼요:


```java
public List<ParkingHistoryResponseDto> findInoutByCarNum(String carNum) {     QParkingHistory ph = QParkingHistory.parkingHistory;     
QParkAreaMaster pa = QParkAreaMaster.parkAreaMaster;      
List<ParkingHistory> results = queryFactory         
.selectFrom(ph)         
.join(ph.parkArea, pa)
.fetchJoin()         
.where(ph.carNo4char.eq(Short.valueOf(carNum))                 .and(ph.inOutStatusCode.eq((byte) 1)).and(ph.outTime.isNull()))         .fetch();      

return results.stream()             
	.map(ParkingHistoryMapper::CarInfoToCarInfoResponseDto)             
	.collect(Collectors.toList()); 
}
```

> `ph.parkArea`는 `@ManyToOne` 관계에서 `mappedBy` 되지 않고 직접 FK 컬럼(`parkAreaCode`)로 매핑돼 있어야 합니다.

---

## 💡 추가 팁

- 위 방식 쓰려면 `ParkingHistory` 엔티티에 아래처럼 `@ManyToOne` 매핑이 되어 있어야 합니다:
```java
@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "parkAreaCode", insertable = false, updatable = false) private ParkAreaMaster parkArea;
```

- `insertable = false, updatable = false` 옵션은 **FK 값은 ParkingHistory에 있지만 ParkArea 정보는 조회 전용**일 때 사용해요.
