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

### 정적 웹페이지의 한계와 WAS

![대표적인 웹서버](screen1.png)

초창기의 웹의 출현 이후 정적(Static) 웹페이지가 대부분이였다. 웹서버는 요청한 HTML 파일을 그대로 내려주는 방식으로 동작한다. 
![웹서버 동작방식](screen3.png)

클라이언트가 브라우저에 `URL`을 입력하여 페이지를 요청하게 되면 `HTTP`요청을 받아 정적인(저장된) 콘텐츠를 사용자에게 전달하고, 클라이언트로 부터 콘텐츠를 받아 저장하거나 처리한다. 위의 그림에서 보이는 것처럼 대표적인 웹서버로는 `Apache`, `Nginx`, `IIS`등이 있다.

하지만 이러한 정적 웹페이지의 내용이 이미 정해져있다. 예를 들어 사용자별 맞춤 정보나 DB 연동이 불가능하여 각각의 사용자의 요구를 맞출수 없어 동적(Dynamic)인 웹페이지가 필요하게 되었다. 

![CGI 동작방식](screen5.png)
이때 등작한것이 CGI(Common Gateway Interface)이다. 가장 오래된 표준 방식으로 웹서버에서 요청을 받으면 `PHP`,`Perl` , `C++` 등의 언어를 지원하면서 웹서버를 통해 요청을 받고 실행한 결과를 다시 웹서버를 거쳐 클라이언트에게 보낸다. 이에 대한 자세한 정보는 [링크](https://bentist.tistory.com/40)를 참고하자.

프로그래밍 언어로 CGI 규격을 준수하는 코드를 작성하면, 웹서버는 클라이언트의 요청에 대해 개별로 프로세스를 생성하는 방식으로 동작한다. 하지만 이부분에서 CGI의 한계가 발생하는데 클라이언트의 요청이 많아지면 각 요청마다 독립 프로세스(멀티 프로세싱)를 생성하는 점이다.

이러한 점을 보완하기위해 다양한 방법이 나왔고, 그중 몇가지를 알아보자.

첫번째로 웹서버에 **스크립트 엔진을 내장**시켜 하나의 프로세스에서 여러 요청을 처리하는 방법이다. 웹서버 내장 모듈 방식이라고 불린다.

![WAS만 사용](screen6.png)
두번째로 사용자의 요청을 처리하는 프로그램을 **WAS(Web Application Server)로 실행**하는 방법이 있다.  백그라운드 프로세스로 HTTP 기반의 사용자의 요청을 기다리다가 요청이 발생하면 내부에서 스레드로 처리하여 로직을 실행 한다.


![WAS & WebServer 사용](screen7.png)

세번째로 **Reverse Proxy & 로드밸런싱** 방법이 있다. 이방법은 웹서버가 클라이언트 대신 WAS의 앞단에서 트래픽을 관리하고 정적파일은 웹서버가 직접 내려주고, 동적요청은 WAS로 포워딩 하는 방식으로, 여러대의 WAS로 분산처리가 가능하다.


![WAS서버](screen2.png)
그럼 WAS는 무엇일까? WAS는 웹에서 HTTP 프로토콜을 통해 사용자의 컴퓨터나 장치에 애플리케이션을 수행해주는 미들웨어로 주로 동적 서버 컨텐츠를 수행한다. 

즉, DB 조회나 로직 처리를 요구하는 동적 컨텐츠를 제공하기 위해 만들어졌으며 웹 컨테이너, 서블릿 컨테이너 등의 이름으로 불린다. 

여기서 Servlet이라는 개념이 등장한다. 서블릿은 1997년 자바 진영에서 웹개발을 위해 Servlet API를 정의했다. [tomcat docs](https://tomcat.apache.org/tomcat-5.5-doc/servletapi/index.html), [orcale docs](https://docs.oracle.com/javaee/7/api/javax/servlet/Servlet.html), [jakarta docs](https://jakarta.ee/specifications/servlet/4.0/apidocs/) 등에서 확인이 가능하고 C언어 기반의 CGI를 대체할수있는 자바 웹 애플리케이션의 표준이라는 목적으로 탄생한 서블릿은 자바의 표준 컴포넌트로 자리잡았다.(CGI가 꼭 C로만 만들어지는건 아님)

위의 이미지에 있는 Tomcat이나 Jetty와 같은 WAS 서버들이 `Servlet API`스펙의 구현체이다.`HttpServletRequest` , `HttpServletResponse` 와 같은 자바 인터페이스를 구현해서 자바 코드로 작성한 서블릿 / 스프링 같은 애플리케이션을 실행 시켜준다.

자바진영에서는 경량 WAS로 Tomcat, Jetty 등을 사용하고, 엔터프라이즈 급으로 IBM WebSphere, JEUS, JBoss 등을 사용한다. 엔터프라이즈 급은 Servlet Container와 J2EE 엔터프라이즈 기능 전체를 구성한다.

다른 진영에서는 `Servlet`을 사용하진 않지만 각 언어별로 표준 인터페이스를 구현하는 WAS가 존재하고 간단하게 살펴보면 다음과 같다.

- Python : WSGI 스펙을 구현한 WAS 사용
- Node.js : 자체 이벤트 루프 기반 HTTP 서버 내장, 대규모 서비스시 PM2, Nginx 등 함께 사용
- Go : WAS기능 내장



### Servlet을 알아보자

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


아래의 그림을 통해 Spring이 없는 상태의 순수 서블릿의 동작 흐름을 살펴보자.
![순수 서블릿 동작 흐름도](screen9.png)

1. **HTTP Request (사용자 → 서버)**
    - 브라우저(클라이언트)가 http://example.com/hello 와 같은 요청 전달
    - TCP/IP를 통해 톰캣(Tomcat) 같은 서블릿 컨테이너가 요청을 받음
        
2. **객체 생성 (HttpServletRequest, HttpServletResponse)**
    - 컨테이너가 요청/응답을 다루기 위해 HttpServletRequest / HttpServletResponse 객체 생성
    - 이 객체에는 요청 헤더, 파라미터, 바디 내용 등이 들어있고, 응답을 작성할 수 있는 출력 스트림도 포함
        
3. **서블릿 분석 (web.xml or 애노테이션 매핑 확인)**
    - 컨테이너는 이 요청이 어떤 서블릿 클래스에 매핑되어야 하는지 확인
    - 예전에는 web.xml에 `servlet-mapping`으로 적어뒀고, 지금은 @WebServlet("/hello") 같은 어노테이션으로 매핑

4. **init() 실행 (최초 1회)**
    - 해당 서블릿 클래스가 처음 로드될 때 한 번만 init() 메소드가 실행
    - DB 연결이나 리소스 초기화 같은 준비 작업을 수행
    - 이미 로드된 서블릿이면 다시 실행하지 않고 넘어감
        
5. **service() 실행 (요청마다)**
    - 서블릿 컨테이너는 요청이 들어올 때마다 service(HttpServletRequest req, HttpServletResponse resp) 메서드를 호출.
    - service()는 요청의 HTTP 메서드(GET, POST 등)를 확인
        
6. **doGet(), doPost() 실행**
    - service()가 요청 타입을 보고 적절한 메서드를 호출
        - GET 요청 → doGet()
        - POST 요청 → doPost()
        - PUT 요청 → doPut()
        - DELETE 요청 → doDelete()
    - 여기서 개발자가 작성한 로직이 실행 (resp.getWriter().write("Hello"); 같은 코드)
        
7. **HTTP Response (서버 → 사용자)**
    - 최종적으로 HttpServletResponse 객체에 담긴 응답(HTML, JSON 등)이 네트워크를 통해 클라이언트 브라우저로 전달


그럼 서블릿을 사용함으로써 얻는 장점은 뭐가있을까?

- 자바 언어의 이식성 → OS 독립적
- 멀티스레딩 지원 → 동시 요청 처리 가능    
- 명확한 API 제공 (HttpServletRequest, HttpServletResponse)
- 웹 애플리케이션 개발의 표준

### Servlet + Spring

자그럼 여기 Spring MVC를 얹으면 어떻게 될까?
![서블릿 + Spring](screen10.png)
1. 클라이언트 요청 (브라우저 → 톰캣)
2. 톰캣 FilterChain 통과 (ex. 보안, 로깅)
3. DispatcherServlet 실행 (Spring MVC 진입점)
4. Handler Mapping → 어떤 컨트롤러 메서드 실행할지 결정
5. Handler Adapter → 컨트롤러 호출 + 파라미터 바인딩
6. Controller 실행 → Service 호출 → Repository → DB
7. 결과 반환 → ViewResolver 또는 JSON 변환 → DispatcherServlet
8. DispatcherServlet이 HttpServletResponse에 응답 작성 후 톰캣이 반환

둘의 차이점을 간단하게 표로 정리해보자.

| 구분      | 순수 서블릿                                   | Spring MVC                                            |
| ------- | ---------------------------------------- | ----------------------------------------------------- |
| 매핑      | web.xml / @WebServlet                    | @Controller + @RequestMapping                         |
| 요청 분배   | 컨테이너가 직접 서블릿 찾아 호출                       | DispatcherServlet (Front Controller)                  |
| 파라미터 처리 | request.getParameter(“id”) 직접 호출         | @RequestParam, @ModelAttribute, @RequestBody 등 자동 바인딩 |
| 응답 작성   | response.getWriter().write(“HTML”) 직접 작성 | 뷰 리졸버, 메시지 컨버터가 자동 처리                                 |
| 난이도     | 로우레벨, 번거로움                               | 추상화 ↑, 생산성 ↑                                          |


### 전체 흐름 보기

브라우저는 사용자가 주소창에 입력한 URL을 기반으로 **HTTP 요청 메시지**를 생성

```
GET /hello HTTP/1.1
Host: example.com
User-Agent: Chrome/...
```

이 요청은 TCP/IP 소켓을 통해 서버의 80(HTTP) 또는 8080(Spring Boot 내장 톰캣 기본 포트)으로 전달된다.

##### 톰캣 Connector가 요청 수신

Spring Boot는 내부적으로 톰캣(서블릿 컨테이너)을 실행한다.

톰캣의 **Connector**(예: Http11NioProtocol)가 8080 포트를 리스닝 중이고, 요청이 들어오면 소켓에서 데이터를 읽는다.
- InputStream으로 Raw HTTP 데이터 수신
- Request Line(GET /hello), Header(User-Agent 등), Body(JSON, Form 데이터 등) 파싱
    

##### HttpServletRequest / Response 객체 생성

톰캣은 파싱한 데이터를 자바 객체로 추상화한다. 하지만 개발자가 직접 다루는 건 HttpServletRequest, HttpServletResponse 인터페이스이다. 그래서 톰캣은 **Facade 패턴**을 적용해 다음과 같은 객체를 만든다.

```java 
HttpServletRequest req = new RequestFacade(catalinaRequest);
HttpServletResponse res = new ResponseFacade(catalinaResponse);
```
- RequestFacade / ResponseFacade : 개발자에게 노출되는 껍데기
- catalinaRequest / catalinaResponse : 내부적으로 실제 동작하는 구현체
    
#### 서블릿 매핑
톰캣은 URL 패턴(/hello)을 보고 어떤 서블릿이 처리해야 하는지 결정한다. 결과적으로 /hello 요청은 결국 DispatcherServlet이 처리하게 된다.

- web.xml 설정
- @WebServlet 어노테이션
- Spring Boot : 자동으로 **DispatcherServlet**에 모든 요청이 매핑 `(/ pattern)`
    

##### DispatcherServlet 동작

이제 요청은 Spring MVC 안으로 들어온다. DispatcherServlet은 스프링에서 가장 중요한 Front Controller 역할을 수행한다. 이 흐름을 살펴보면 아래와 같다.

1. service() 실행 → doDispatch() 호출
2. **HandlerMapping** : URL과 매핑된 컨트롤러 메서드 검색
    ex) /hello → HelloController.hello()
3. **HandlerAdapter** : 컨트롤러 실행 준비
    - 파라미터 바인딩 (@RequestParam, @RequestBody)
    - 데이터 변환
4. **컨트롤러 실행** : 실제 비즈니스 로직 수행
```java
@GetMapping("/hello")
public String hello() {
    return "hello.html";
}
```
5. **ViewResolver 처리**
    - String 반환 시 : 템플릿 엔진(Thymeleaf 등)으로 HTML 렌더링
    - @RestController 반환 시 : 객체 → JSON 직렬화
        
##### HttpServletResponse 채우기

컨트롤러 결과가 나오면, DispatcherServlet은 응답을 HttpServletResponse에 작성한다. 예시는 아래와 같다.
- 상태 코드 (200 OK)
- 헤더 (Content-Type: text/html; charset=UTF-8)
- 바디 (HTML, JSON 등)
    

##### 톰캣이 응답 전송

응답이 준비되면 DispatcherServlet은 제어권을 톰캣에게 반환한다. 톰캣은 ResponseFacade 내부 버퍼에 있는 내용을 TCP 소켓의 OutputStream으로 `flush` 한다.

##### 클라이언트 수신

브라우저는 서버로부터 전달된 HTTP 응답을 받고, HTML이라면 화면에 렌더링하고, JSON이라면 개발자도구의 Network 탭에서 확인할 수 있게 된다.