---
slug: oauth-github
title: Github로 OAuth2 빠르게 구현하기
authors:
  - haeyoung
tags:
  - oauth2
  - spring
  - Kotlin
---
개인 프로젝트에 로그인 기능을 넣으려고 하다가, 직접 회원가입/로그인을 구현하는게 너무 번거로워서 `OAuth2`를 도입하기로 했다. 그중에서도 개발자라면 누구나 가지고 있는 `GitHub` 계정을 활용한 소셜 로그인을 구현해보자.

### OAuth2 간단 정리

`OAuth2`는 외부 서비스(GitHub, Google 등)에 사용자 인증을 위임하는 프로토콜이다. 직접 비밀번호를 관리할 필요가 없고, 사용자 입장에서도 클릭 몇 번으로 로그인이 가능해진다. 흐름을 간단하게 정리하면 다음과 같다.

1. 사용자가 "GitHub로 로그인" 버튼 클릭
2. GitHub 인증 페이지로 리다이렉트
3. 사용자가 GitHub에서 권한 허용
4. GitHub이 `Authorization Code`를 우리 서버로 전달
5. 서버가 `Authorization Code`로 `Access Token` 요청
6. `Access Token`으로 GitHub API에서 사용자 정보 조회
7. 사용자 정보를 기반으로 회원가입/로그인 처리

### GitHub OAuth App 등록

먼저 GitHub에서 OAuth App을 등록해야한다. [GitHub Developer Settings](https://github.com/settings/developers)에 접속해서 `New OAuth App`을 클릭하자.

```bash
Application name: 내 프로젝트 이름
Homepage URL: http://localhost:8080
Authorization callback URL: http://localhost:8080/login/oauth2/code/github
```

등록하면 `Client ID`와 `Client Secret`이 발급된다. 이 값들을 잘 저장해두자.

### 의존성 추가

`build.gradle.kts`에 다음 의존성을 추가한다.

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-web")
}
```

`spring-boot-starter-oauth2-client`만 추가하면 Spring Security가 OAuth2 로그인 흐름을 거의 다 처리해준다. 이게 진짜 편하다.

### application.yml 설정

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          github:
            client-id: ${GITHUB_CLIENT_ID}
            client-secret: ${GITHUB_CLIENT_SECRET}
            scope: read:user, user:email
```

`scope`에 `read:user`와 `user:email`을 넣어줘야 사용자 프로필과 이메일 정보를 가져올수있다. 여기까지만 설정하면 사실 `/login` 으로 접근하면 GitHub 로그인 화면이 뜬다. 하지만 로그인 이후 사용자 정보를 저장하고 관리하려면 추가 작업이 필요하다.

### Entity 구성

GitHub에서 가져온 사용자 정보를 저장할 `Entity`를 만들자.

```kotlin
@Entity
@Table(name = "users")
class User(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(unique = true, nullable = false)
    val githubId: Long,

    var name: String,

    var email: String?,

    var avatarUrl: String?,

    @Enumerated(EnumType.STRING)
    var role: Role = Role.USER,
)

enum class Role {
    USER, ADMIN
}
```

```kotlin
interface UserRepository : JpaRepository<User, Long> {
    fun findByGithubId(githubId: Long): User?
}
```

### OAuth2 로그인 처리

핵심은 `OAuth2UserService`를 커스텀하는 부분이다. GitHub에서 받아온 사용자 정보를 우리 DB에 저장하는 로직을 작성하자.

```kotlin
@Service
class CustomOAuth2UserService(
    private val userRepository: UserRepository,
) : DefaultOAuth2UserService() {

    override fun loadUser(userRequest: OAuth2UserRequest): OAuth2User {
        val oAuth2User = super.loadUser(userRequest)
        val attributes = oAuth2User.attributes

        val githubId = (attributes["id"] as Int).toLong()
        val name = attributes["login"] as String
        val email = attributes["email"] as? String
        val avatarUrl = attributes["avatar_url"] as? String

        val user = userRepository.findByGithubId(githubId)
            ?: userRepository.save(
                User(
                    githubId = githubId,
                    name = name,
                    email = email,
                    avatarUrl = avatarUrl,
                )
            )

        // 기존 유저라면 정보 업데이트
        user.name = name
        user.email = email
        user.avatarUrl = avatarUrl
        userRepository.save(user)

        return DefaultOAuth2User(
            listOf(SimpleGrantedAuthority("ROLE_${user.role.name}")),
            attributes,
            "login" // GitHub의 nameAttributeKey
        )
    }
}
```

GitHub에서 넘어오는 `attributes`에는 `id`, `login`, `email`, `avatar_url` 등이 포함되어있다. 처음 로그인하는 사용자라면 `save`하고, 기존 사용자라면 정보를 업데이트 해준다.

### Security 설정

```kotlin
@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val customOAuth2UserService: CustomOAuth2UserService,
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .authorizeHttpRequests {
                it
                    .requestMatchers("/", "/login/**", "/css/**", "/js/**").permitAll()
                    .anyRequest().authenticated()
            }
            .oauth2Login {
                it.userInfoEndpoint { endpoint ->
                    endpoint.userService(customOAuth2UserService)
                }
                it.defaultSuccessUrl("/", true)
            }
            .logout {
                it.logoutSuccessUrl("/")
            }

        return http.build()
    }
}
```

`oauth2Login`에 우리가 만든 `customOAuth2UserService`를 등록해주면 된다. 로그인 성공시 메인 페이지로 리다이렉트 되도록 설정했다.

### 로그인 사용자 정보 가져오기

컨트롤러에서 로그인된 사용자 정보를 가져오는 방법은 다음과 같다.

```kotlin
@RestController
class UserController {

    @GetMapping("/api/user")
    fun getUser(@AuthenticationPrincipal oAuth2User: OAuth2User): Map<String, Any?> {
        return mapOf(
            "name" to oAuth2User.attributes["login"],
            "avatar" to oAuth2User.attributes["avatar_url"],
            "email" to oAuth2User.attributes["email"],
        )
    }
}
```

`@AuthenticationPrincipal`을 통해 현재 로그인한 사용자의 정보를 바로 꺼내올수있다.

### 마무리

`Spring Security` + `OAuth2 Client`를 사용하면 GitHub 로그인 구현이 정말 간단하다. 직접 해보면 `application.yml` 설정과 `OAuth2UserService` 하나만 구현하면 거의 끝난다. 회원가입 폼이나 비밀번호 관리 같은 귀찮은 작업을 전부 생략할수있다는게 가장 큰 장점이다. 하지만 GitHub OAuth는 개발자 대상 서비스에서 적합하고, 일반 사용자 대상이라면 Google이나 Kakao를 추가하는게 좋겠다.
