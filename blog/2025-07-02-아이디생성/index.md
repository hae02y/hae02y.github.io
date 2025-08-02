---
slug: generateid
title: JPA 도입 그리고 ID 생성 방식
authors:
  - haeyoung
tags:
  - API
  - Java
  - Jpa
---
이번 프로젝트에서 ORM으로 `JPA`를 사용하게 되었다. 설계단계에서 비즈니스 로직의 대부분이 CRUD로 이뤄져 생산성 향상 측면에서 유리할것 같아 제안했고, 도입이 이뤄졌다. 이로인해 실제로 코드의 복잡도나 유지보수성이 크게 향상되었지만 예상치 못한곳에서 문제가 발생했다. 바로 `ID` 생성 방식때문이였다.    

기존에는 `fn_sys_seq`와 같은 프로시저를 정의해두고 호출해서 문자열 ID를 생성했었는데 `JPA` 자체의 ID 생성 전략과 기존방식이 근본적으로 충돌함을 확인하게 되었다.

### 기존 생성 방식

기존 시스템에서는 다음과 같은 방식으로 ID를 생성해왔다.    
  
- ID는 단순 숫자가 아니라 "USR0000001" 처럼 도메인 접두사 + 일련번호 포멧의 문자열 형태
- 각 테이블에 대응되는 문자열 키를 테이블에 연계해놓고 이를 기준으로 ID를 생성
- 해당 키를 기반으로 프로시저를 호출하여 최신의 새로운 ID를 가져옴

```sql
create  
    definer = root@`%` function fn_sys_seq(p_seq_id char(3)) returns char(9) modifies sql data  
BEGIN  
    DECLARE _curr  INT(6);  
    DECLARE _max   INT(6);  
    SELECT curr_val, max_val  
      INTO _curr, _max  
      FROM tb_sys_sequence  
     WHERE seq_id = p_seq_id;  
       SET _curr = _curr + 1;  
    IF (_curr > _max) THEN  
      SET _curr = 0;  
    END IF;  
    UPDATE tb_sys_sequence  
       SET curr_val = _curr  
     WHERE seq_id = p_seq_id;  
     RETURN CONCAT(UPPER(p_seq_id),lpad(_curr, 6, 0));  
END;  
  
grant execute on function fn_sys_seq to user;
```

| seq\_id | tbl\_nm        | curr\_val | max\_val |
| :------ | :------------- | :-------- | :------- |
| USR     | tb_domain_user | 1         | 999999   |

이방식으로 레거시 환경에서는 `Mybatis`기반으로 프로시저를 호출하여 사용하여 문제가 없었고, 현재 시스템 전체에서 사용되고 있는 방식이다. 하지만 `JPA`를 도입하면서 이방식은 더이상 단순히 통합 할 수없는 구조가 되었다.


#### 발생한 문제 : JPA ID 생성전략과 문자열

`JPA`의 기본 ID 생성 전략은 문자열과 호환되지 않는다. `JPA`는 일반적으로 `@GeneratedValue`어노테이션을 통해 ID를 자동으로 생성하도록 구성된다. 하지만 IDENTITY, SEQUENCE, AUTO 전략을 통해 자동으로 숫자형 ID 를 생성하게 된다. 즉 문자열 기반의 외부 ID를 사용하는 경우 직접 생성을 하고 save() 호출전에 setId()로 값을 지정해줘야한다. 나는 이부분을 해결하기 위해 커스텀 어노테이션을 작성하였다. 

```java
@Retention(RetentionPolicy.RUNTIME)  
@Target(ElementType.TYPE)  
@Documented  
public @interface SequenceKey {  
    String value();  
}
```

```java
@Component  
public class IDGeneratorUtil {  
    @PersistenceContext  
    private EntityManager entityManager;  
  
    public String make(Class<?> entityClass) {  
        SequenceKey annotation = entityClass.getAnnotation(SequenceKey.class);  
  
        if(annotation == null) {  
            throw new IllegalArgumentException("SequenceKey 없음");  
        }  
  
        String seqId = annotation.value();  
  
        StoredProcedureQuery query = entityManager.createStoredProcedureQuery("fn_sys_sequence");  
  
        query.registerStoredProcedureParameter("seq_id", String.class, ParameterMode.IN);  
        query.registerStoredProcedureParameter("new_id", String.class, ParameterMode.OUT);  
  
        query.setParameter("seq_id", seqId);  
        query.execute();  
        return (String) query.getOutputParameterValue("new_id");  
    }  
}
```

그리고 엔티티에 다음과 같이 커스텀 어노테이션을 적용해 동작하도록 하였다.

```java  
@Entity  
@Getter  
@Table(name = "tb_domain_user")  
@SequenceKey("USR")  
public class User {  
  
    @Id  
    @Column(name = "usr_seq")  
    private String usrSeq;  

	...
}
```

#### 발생한 문제 : 불필요한 쿼리 발생

위방식을 통해 정상적으로 USR와 매칭되는 ID가 생성되어 DB에 반영됨을 확인했다. 하지만 로그를 살펴보니 한가지 문제가 있었다. `SELECT` 쿼리가 예상과 다르게 3번 발생하게 되는 것이다. 이내용을 아래 표를 통해 살펴보자.

| **단계** | **쿼리**                         | **설명**                        |
| ------ | ------------------------------ | ----------------------------- |
| 1      | CALL fn_sys_seq(...)           | ID 생성용 프로시저 호출                |
| 2      | SELECT * FROM ... WHERE id = ? | JPA 내부 merge 경로에서 id 존재 여부 확인 |
| 3      | INSERT INTO ...                | 실제 persist                    |

프로시저 1회 + SELECT 1회 + INSERT 1회 이렇게 총 3번의 쿼리가 발생하게 된다. JpaRepository에서 save(entity)를 호출시, `JPA`는 해당 엔티티가 신규인지 판단하기 위해 `merge` 실행 과정중 `SELECT` 쿼리로 ID 존재여부를 확인하게 된다. 그리고 존재하지 않음을 확인하고 다시 persist()를 수행한다.    

- IDGeneratorUtil로 String id를 만들어 setId()
- id != null이므로 JPA는 기존 객체라고 판단
- merge() 경로로 진입
- SELECT 수행 (id 존재 여부 확인)
- 존재하지 않음 → 다시 persist() 수행    

우리가 `fn_sys_seq`를 통해 가져온 값은 이미 DB조회를 통해 최신 상태의 값으로 가져왔고 이를 테이블에서 확인할 필요는 없다. 

- IDGeneratorUtil.make()로 ID 생성 (fn_sys_seq 프로시저 호출)
- 생성한 ID를 엔티티에 직접 주입 (new User(id, ...))
- JPA save() 호출 → id != null이므로 JPA는 merge() 수행
- **불필요한 SELECT 쿼리 발생**


문자열을 수동으로 할당하고 save()를 호출하면, Hibernate는 해당 ID의 존재여부를 알기위해 `SELECT` 쿼리를 먼저 실행하고, 결과가 없을때 `INSERT`를 수행한다.

