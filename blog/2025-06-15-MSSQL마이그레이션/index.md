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
Servlet에 대해 얼마나 알고있을까? 서블릿에 대해 공부하기전에 동적인 웹페이지의 탄생 배경을 먼저 알아보자.

### 정적 웹페이지의 한계

![대표적인 웹서버](screen1.png)

초창기의 웹의 출현 이후 정적(Static) 웹페이지가 대부분이였다. 웹서버는 요청한 HTML 파일을 그대로 내려주는 방식으로 동작한다. 
![웹서버 동작방식](screen3.png)

클라이언트가 브라우저에 `URL`을 입력하여 페이지를 요청하게 되면 `HTTP`요청을 받아 정적인(저장된) 콘텐츠를 사용자에게 전달하고, 클라이언트로 부터 콘텐츠를 받아 저장하거나 처리한다. 위의 그림에서 보이는 것처럼 대표적인 웹서버로는 `Apache`, `Nginx`, `IIS`등이 있다.

하지만 이러한 정적 웹페이지의 내용이 이미 정해져있다. 예를 들어 사용자별 맞춤 정보나 DB 연동이 불가능하여 각각의 사용자의 요구를 맞출수 없어 동적(Dynamic)인 웹페이지가 필요하게 되었다. 

![CGI 동작방식](screen5.png)
이때 등작한것이 CGI(Common Gateway Interface)이다. 가장 오래된 표준 방식으로 웹서버에서 요청을 받으면 `PHP`,`Perl` , `C++` 등의 언어를 지원하면서 웹서버를 통해 요청을 받고 실행한 결과를 다시 웹서버를 거쳐 클라이언트에게 보낸다. 이에 대한 자세한 정보는 [링크](https://bentist.tistory.com/40)를 참고하자.

프로그래밍 언어로 CGI 규격을 준수하는 코드를 작성하면, 웹서버는 클라이언트의 요청에 대해 개별로 프로세스를 생성하는 방식으로 동작한다. 하지만 이부분에서 하

![WAS서버](screen2.png)


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

**서블릿의 동작 흐름**
1. 클라이언트 요청 (http://example.com/test)
2. 웹 서버(Tomcat 등) → 해당 요청을 파싱
3. 서블릿 컨테이너가 **HttpServletRequest/HttpServletResponse 객체 생성**
4. 서블릿 클래스의 service() 메서드 호출
    - 내부에서 doGet(), doPost() 등으로 분기
5. 개발자가 작성한 로직 실행
6. 결과를 Response 객체에 담아 반환
7. 컨테이너가 HTTP 응답을 클라이언트로 전송