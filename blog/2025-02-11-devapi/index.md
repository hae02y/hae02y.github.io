---
slug: mybatis-2
title: API 생성에서 나왔던 문제
authors:
  - haeyoung
tags:
  - troubleshooting
---

오늘 업무중 기존 레거시로 구현된 앱의 레거시 API를 떼어내고 신규로 만든 APP과 신규로 구현한 API서버를 연동하는 과정에서 공지사항 관련된 API를 구현해야하는 업무가 생겼다.

해당업무를 위해서 나는 기존 코드를 탐색했다.

기존 구현된 앱을 따라가는 입장이여서 앱파트쪽에서 요청사항을 받아 API설계를 진행하기로 하였다.

요청사항을 분석해보면 다음과 같다.
- 기존에 보내던 API와 응답값이 같았으면 좋겠다.
- 주차장별 공지사항과 주차장 전체 공지사항을 분리하여 API 엔드포인트를 생성해 달라.
- 등등

업무를 진행하는 flow는 아래와 같다.

.. 대충 설명하는 그림


구현 상황에서 

```java
package com.vstl.wm.api.model.response;  
  
import com.fasterxml.jackson.annotation.JsonIgnore;  
import lombok.*;  
  
import java.util.Date;  
  
@Getter  
@Setter  
@AllArgsConstructor  
@NoArgsConstructor  
@Builder  
public class ResPkLotNoticeForAnsan {  
    @JsonIgnore(value = true)  
    private String pkl_seq;  
    private String lnt_seq;  
    private String event_type;  
    private String title;  
    private String content;  
    private String url;  
    private String event_start;  
    private String event_end;  
    private String created_on;  
    private String modified_on;  
}
```
