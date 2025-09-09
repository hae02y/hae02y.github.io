---
slug: Servlet 에 Deep Dive
title: MSSQL을 마이그레이션 하자!
authors:
  - haeyoung
tags:
  - API
  - Java
  - Jpa
---
Servlet에 대해 얼마나 알고있을까?

> 클라이언트의 요청을 처리하고, 그 결과를 반환하는 자바로 만든 HTTP 애플리케이션의 표준 인터페이스

간단하게 말해 서블릿이란 **자바를 사용하여 웹을 만들기 위한 기술**이다. 웹서버가 파싱한 요청과 응답을 개발자가 작성한 클래스로 넘겨주고, 그 클래스가 비즈니스 로직을 수행하여 응답을 만들어낸다. Spring MVC도 결국 서블릿 위에 올라가는 프레임워크이고, 핵심 컨트롤러가 바로 `DispatcherServlet` 이다.

먼저 서블릿의 특징 부터 살펴보자.

- 클라이언트의 요청에 대해 동적으로 작동하는 웹 어플리케이션 컴포넌트
- Servlet API는 javax.servlet.* 또는 jakarta.servlet.* 패키지로 제공
- Servlet Container(Tomcat, Jetty, Undertow 등)가 요청/응답 객체를 만들어 서블릿에 전달
- Java Thread를 이용하여 동작
- MVC 패턴에서 `Controller` 담당
- `HTTP`프로토콜 서비스를 지원하는 HttpServlet 클래스를 상속
- TCP 위에서 동작하는 HTTP를 기반으로 요청/응답 처리 UDP 같은 비연결형보다 느리지만 신뢰성 제공

