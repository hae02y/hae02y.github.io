---
slug: cookie-session
title: 쿠키와 세션 그리고 JWT
authors:
  - haeyoung
tags:
  - Java
  - Web
---

### 세션
HTTP는 **완전한 Stateless 프로토콜**이라서 요청 한번이 끝나고 나면 해당 요청에 대해서 기억하지 않는다. 그래서 서버가 기억해야할 것들(로그인정보, 장바구니, 임시 값) 등을 어딘가에 저장해 두고, 다른 요청에서도 꺼낼수있게 만든것이 `Session`이다. 이러한 세션의 흐름은 다음과 같다.

1. 클라이언트가 첫 요청 > 서버가 `HttpSession` 생성
2. 서버가 세션ID를 발급 > `JSESSIONID`를 쿠키로 내려줌
3. 다음 요청에서 브라우저가 `JSESSIONID = <value>` 쿠키를 같이 보냄
4. 서버는 그 ID로 세션 저장소에서 데이터를 찾아서 사용

위의 순서에 맞춰 테스트를 통해서 확인해보자 

```java
@PostMapping("/set")  
fun setSession(
				@RequestParam name : String, 
				@RequestParam value : String, 
				session: HttpSession) : String {  
    session.setAttribute(name, value)  
    print(session.id)  
    return "$name: $value"  
}
```



