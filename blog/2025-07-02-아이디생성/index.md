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


#### 발생한 문제

`JPA`의 기본 ID 생성 전략은 문자열과 호환되지 않는다. `JPA`는 일반적으로 `@GeneratedValue`어노테이션을 통해 ID를 자동으로 생성하도록 구성된다. 하지만 IDENTITY, SEQUENCE, AUTO 전략을 통해 자동으로 숫자형 ID 를 생성하게 된다. 

