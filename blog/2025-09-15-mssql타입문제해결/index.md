---
slug: nvarchar
title: SQL Server NVARCHAR 해결
authors:
  - haeyoung
tags:
  - Java
  - TroubleShootiong
---
프로젝트 QA중 특정 기능에서 조회 성능이 굉장히 떨어져 타임아웃까지 응답이 불가능한 문제가 발생하였다. 조회 요청을 보내는 테이블에 데이터가 꽤나 많았고, 추후 최적화를 진행하려고 했던터라 개발 단계에서 신경쓰지 못했었지만, 이번 오류 대응 과정을 통해서 배웠고, 앞으로도 주의해야할 내용을 공유해 보고자 한다.

## 문제점

```java
InOutDTO agoInOut = inOutDAO.selectInOut(inoutModifyRequest.getTicketNo());
```

`TicketNo`를 통해 이전 데이터를 가져온후 다양한 service에 변경 사항을 `update`해야하는 내용이 있었고, `update` 할곳이 꽤나 많다보니 여기서 문제가 발생한다고 생각했었는데 알고보니 `select` 자체에서 문제가 발생하고 있었다. 형변환도 정상적으로 되고 있고, 조회도 느리긴하지만 되기 때문에 큰문제가 아니라고 생각했지만 오산이였다. DB Lock 이슈를 유발하는 SQL 문은 아래와 같다.

```sql
 <select id="selectInOut"
            resultType="com.vstl.ansan.api.dto.InOutDTO">
        SELECT
        PH.ticketNo,
        PM.parkAreaName,
        PH.carNo,
        PH.parkingDay,
        DM.discountName AS discountName,
        ...
        FROM parking_history PH
        INNER JOIN ...
        ...
        WHERE PH.ticketNo = #{ticketNo}
        AND PH.useOk = 1
    </select>
```

`SQL Server JDBC Driver` 는 String 파라미터를 모두 `NVARCHAR`로 매핑한다. PreparedStatement.set 호출시 명시적으로 `VARCHAR` 매핑을 지정해도 `NVARCHAR로` 변환하여 매핑한다. 이로 인해 Query를 모니터링 해보니 CPU를 많이 소모 하고있었다.  WHERE 절에 걸려있는 `#{ticketNo}`는 parking_history 에서 


