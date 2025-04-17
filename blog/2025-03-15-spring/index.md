---
slug: springid
title: JPA에서 @ID를 사용하는 다양한 방법을 소개합니다.
authors:
  - haeyoung
tags:
  - JPA
  - DB
  - spring
  - Java
---

### 고려사항
---
이번 프로젝트를 진행하면서 JPA를 사용할수있게 됐는데 문제는 이전의 ID generating 방식을 고수하다보니 문제가 발생한다.

JPA에서는 프로시저를 호출하여 아이디를 확인하는게 어려워진다.

- 분산환경에서의 ID 동일화 문제
- Generate가 Integer가 아닌 String 이여서 Identity 등을 사용하기가 어려움
- 기존 프로시저를 업데이트
- 테이블을 통해 호출하여 증가시키는 방법을 고려
- 테스트를 진행함
- 아이디 만드는 방식