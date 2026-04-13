---
slug: cookie-session
title: 쿠키와 세션 그리고 JWT
authors:
  - haeyoung
tags:
  - Java
  - Web
---

HTTP는 **완전한 Stateless 프로토콜**이라서 요청 한번이 끝나고 나면 해당 요청에 대해서 기억하지 않는다. 그래서 서버가 기억해야할 것들(로그인정보, 장바구니, 임시 값) 등을 어딘가에 저장해두는 방법이 필요한데, 대표적으로 `Cookie`, `Session`, `JWT`가 있다. 이 세가지를 정리해보자.

### 쿠키

`Cookie`는 서버가 클라이언트(브라우저)에 저장하라고 보내는 작은 데이터 조각이다. 브라우저는 이후 요청마다 해당 쿠키를 자동으로 같이 보내준다.

```kotlin
@GetMapping("/set-cookie")
fun setCookie(response: HttpServletResponse): String {
    val cookie = Cookie("username", "hae02y")
    cookie.maxAge = 60 * 60 // 1시간
    cookie.path = "/"
    response.addCookie(cookie)
    return "쿠키 설정 완료"
}

@GetMapping("/get-cookie")
fun getCookie(@CookieValue(name = "username", required = false) username: String?): String {
    return "쿠키 값: $username"
}
```

쿠키의 특징을 정리하면 다음과 같다.

1. **클라이언트에 저장**: 브라우저 로컬에 저장되므로 서버 부담이 없다
2. **자동 전송**: 같은 도메인에 대한 요청 시 자동으로 포함된다
3. **용량 제한**: 약 4KB로 크기 제한이 있다
4. **보안 취약**: 클라이언트에 저장되므로 조작이 가능하다

하지만 쿠키에 중요한 정보(비밀번호, 개인정보)를 직접 저장하면 큰 문제가 된다. 브라우저 개발자 도구에서 누구나 볼수있기 때문이다. 그래서 나온게 `Session`이다.

### 세션

`Session`은 서버가 기억해야할 것들을 서버측 저장소에 보관하고, 클라이언트에는 해당 저장소를 찾을수있는 `ID`만 전달하는 방식이다. 흐름은 다음과 같다.

1. 클라이언트가 첫 요청 → 서버가 `HttpSession` 생성
2. 서버가 세션ID를 발급 → `JSESSIONID`를 쿠키로 내려줌
3. 다음 요청에서 브라우저가 `JSESSIONID = <value>` 쿠키를 같이 보냄
4. 서버는 그 ID로 세션 저장소에서 데이터를 찾아서 사용

위의 순서에 맞춰 테스트를 통해서 확인해보자.

```kotlin
@PostMapping("/set")
fun setSession(
    @RequestParam name: String,
    @RequestParam value: String,
    session: HttpSession,
): String {
    session.setAttribute(name, value)
    print(session.id)
    return "$name: $value"
}

@GetMapping("/get")
fun getSession(
    @RequestParam name: String,
    session: HttpSession,
): String {
    val value = session.getAttribute(name)
    return "$name: $value (sessionId: ${session.id})"
}
```

`/set`으로 값을 저장한 후 `/get`으로 조회하면, 같은 `sessionId`로 데이터를 꺼내오는걸 확인할수있다. 응답 헤더를 보면 `Set-Cookie: JSESSIONID=...`가 내려오는것도 확인 가능하다.

#### 세션의 한계

세션은 서버 메모리에 저장된다. 이게 서버가 1대일때는 문제가 없지만, 서버가 여러대로 늘어나면 문제가 생긴다.

```
사용자 → 서버A (세션 생성)
사용자 → 서버B (세션 없음 → 로그인 풀림!)
```

이를 해결하는 방법으로는 `Sticky Session`, `Session Clustering`, `Redis 세션 저장소` 등이 있다. 하지만 어떤 방법을 쓰든 서버가 상태를 관리해야한다는 근본적인 문제는 남아있다. 이걸 해결하는게 `JWT`다.

### JWT (JSON Web Token)

`JWT`는 서버가 상태를 저장하지 않고, 토큰 자체에 필요한 정보를 담아서 클라이언트에게 전달하는 방식이다. 서버는 토큰의 서명만 검증하면 되므로 완전한 `Stateless`를 유지할수있다.

#### JWT 구조

```
Header.Payload.Signature
```

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoYWUwMnkiLCJyb2xlIjoiVVNFUiIsImV4cCI6MTcwOTI4OTYwMH0.xxxxx
```

- **Header**: 알고리즘, 토큰 타입 정보
- **Payload**: 사용자 정보, 만료시간 등 (Claims)
- **Signature**: Header + Payload를 비밀키로 서명한 값

Payload는 `Base64`로 인코딩되어있을뿐 암호화된게 아니다. 누구나 디코딩해서 볼수있으므로 비밀번호 같은 민감 정보는 넣으면 안된다.

#### JWT 흐름

1. 사용자가 로그인 요청
2. 서버가 인증 후 JWT를 발급
3. 클라이언트가 이후 요청마다 `Authorization: Bearer <token>` 헤더에 토큰을 포함
4. 서버는 토큰의 서명을 검증하고, Payload에서 사용자 정보를 꺼냄

#### Spring Boot 구현

`JJWT` 라이브러리를 사용해서 구현해보자.

```kotlin
dependencies {
    implementation("io.jsonwebtoken:jjwt-api:0.12.3")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.3")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.3")
}
```

```kotlin
@Component
class JwtProvider(
    @Value("\${jwt.secret}") private val secret: String,
    @Value("\${jwt.expiration}") private val expiration: Long,
) {

    private val key: SecretKey by lazy {
        Keys.hmacShaKeyFor(secret.toByteArray())
    }

    // 토큰 생성
    fun createToken(username: String, role: String): String {
        val now = Date()
        return Jwts.builder()
            .subject(username)
            .claim("role", role)
            .issuedAt(now)
            .expiration(Date(now.time + expiration))
            .signWith(key)
            .compact()
    }

    // 토큰 검증 및 파싱
    fun parseToken(token: String): Claims {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload
    }

    // 토큰 유효성 검사
    fun isValid(token: String): Boolean {
        return try {
            parseToken(token)
            true
        } catch (e: JwtException) {
            false
        }
    }
}
```

```kotlin
@RestController
class AuthController(
    private val jwtProvider: JwtProvider,
) {

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): Map<String, String> {
        // 실제로는 DB에서 사용자 인증
        if (request.username == "hae02y" && request.password == "1234") {
            val token = jwtProvider.createToken(request.username, "USER")
            return mapOf("token" to token)
        }
        throw RuntimeException("인증 실패")
    }

    @GetMapping("/me")
    fun me(@RequestHeader("Authorization") auth: String): Map<String, Any?> {
        val token = auth.removePrefix("Bearer ")
        val claims = jwtProvider.parseToken(token)
        return mapOf(
            "username" to claims.subject,
            "role" to claims["role"],
        )
    }
}
```

### 비교 정리

| 항목 | Cookie | Session | JWT |
|---|---|---|---|
| 저장 위치 | 클라이언트 | 서버 | 클라이언트 |
| 상태 관리 | Stateless | Stateful | Stateless |
| 확장성 | 좋음 | 서버 증가시 문제 | 좋음 |
| 보안 | 조작 가능 | 서버에서 관리 | 서명으로 위변조 방지 |
| 용량 | ~4KB | 서버 메모리 | 토큰 크기만큼 |
| 만료 | 쿠키 만료시간 | 서버 설정 | 토큰 내 exp |

### 마무리

세가지 방식 모두 장단점이 있어서 상황에 따라 선택해야한다. 단일 서버라면 `Session`이 가장 간단하고, 서버가 여러대이거나 MSA 환경이라면 `JWT`가 적합하다. 하지만 JWT도 토큰 탈취 문제가 있으므로 `Access Token` + `Refresh Token` 조합으로 사용하는게 일반적이다. 이 부분은 다음에 좀더 깊게 다뤄보겠다.
