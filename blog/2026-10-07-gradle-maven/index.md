---
slug: gradle-vs-maven-practical-guide
title: Gradle과 Maven, 무엇이 다르고 Gradle은 어떻게 써야 할까

authors:
  - haeyoung
tags:
  - Java
  - Gradle
  - Maven
  - Build
  - Backend
  - DevOps
---

Java 프로젝트를 시작하면 거의 항상 Gradle과 Maven 중 하나를 선택하게 된다. 둘 다 소스 코드를 컴파일하고, 테스트하고, JAR·WAR를 만들고, 외부 라이브러리를 내려받는 빌드 도구다. 그래서 처음에는 XML이냐 Groovy/Kotlin DSL이냐 정도의 차이로 보이지만, 프로젝트가 커지면 빌드 모델과 운영 방식의 차이가 분명해진다.

이번 글에서는 두 도구의 문법보다 **빌드가 어떤 입력을 받아 어떤 순서로 산출물을 만드는지**에 집중한다. 마지막에는 Gradle을 선택했을 때 팀에서 유지보수하기 좋은 기본 구성과 피해야 할 설정까지 예시로 정리한다.

## 빌드 도구가 실제로 하는 일

WAS에 배포할 Spring Boot 애플리케이션을 예로 들면 빌드는 다음 일을 수행한다.

1. 저장소에서 의존성과 플러그인을 찾는다.
2. 컴파일 클래스패스를 구성한다.
3. 소스와 리소스를 컴파일한다.
4. 단위 테스트와 검증 작업을 실행한다.
5. 실행 가능한 JAR 또는 WAR를 만든다.
6. 필요한 경우 사설 저장소나 CI 아티팩트 저장소에 게시한다.

```mermaid
flowchart LR
  A[소스 코드] --> B[의존성 해결]
  B --> C[컴파일]
  C --> D[테스트]
  D --> E[패키징 JAR/WAR]
  E --> F[저장소 게시 또는 배포]
```

Gradle과 Maven 모두 이 흐름을 자동화하지만, Maven은 정해진 lifecycle과 XML 설정을 중심으로 하고 Gradle은 task 그래프와 프로그래밍 가능한 빌드 모델을 중심으로 한다.

## 워커(worker)란 무엇인가

빌드에서 말하는 워커는 **작업을 실제로 맡아 실행하는 독립적인 실행 단위**다. 다만 문맥에 따라 세 가지를 구분해야 한다.

| 종류 | 실행 단위 | 메모리 공유 | 주로 쓰이는 곳 |
| --- | --- | --- | --- |
| 스레드 워커 | 같은 JVM의 스레드 | 일부 공유 | 작은 독립 작업 |
| 프로세스 워커 | 별도 JVM 프로세스 | 분리 | 충돌 가능성이 있는 플러그인·도구 |
| CI 워커/러너 | 빌드를 실행하는 머신 또는 컨테이너 | 보통 빌드별 분리 | GitHub Actions, Jenkins 등 |

예를 들어 `./gradlew test`를 실행하면 Gradle 데몬이 프로젝트를 분석하고 task 그래프를 만든다. 이후 모든 task가 무조건 워커 하나씩 되는 것이 아니다. Gradle이 계산한 의존 관계에 따라 여러 프로젝트의 task를 병렬로 실행할 수 있고, 커스텀 task가 파일별 작업을 다시 쪼개고 싶을 때 Worker API를 사용할 수 있다.

```text
Gradle Daemon
 ├─ :domain:compileJava
 ├─ :api:compileJava        ← domain 완료 후 실행
 ├─ :infra:compileJava      ← domain과 독립이면 병렬 실행 가능
 └─ :test                   ← 필요한 컴파일 완료 후 실행

커스텀 task 내부
 ├─ 파일 A 처리 워커
 ├─ 파일 B 처리 워커
 └─ 파일 C 처리 워커
```

Gradle Worker API는 하나의 task를 여러 독립 작업으로 나누어 동시에 실행하는 API다. 파일마다 해시를 계산하거나 여러 스키마 파일을 생성하는 것처럼 각 입력이 서로 영향을 주지 않는 작업에 적합하다. 작업이 같은 전역 상태나 같은 출력 파일을 동시에 수정하면 워커 수를 늘리는 순간 결과가 깨질 수 있다.

### Worker API 예시

```kotlin
abstract class HashFiles : DefaultTask() {
    @get:Inject
    abstract val workerExecutor: WorkerExecutor

    @get:InputFiles
    abstract val sources: ConfigurableFileCollection

    @TaskAction
    fun hash() {
        val queue = workerExecutor.noIsolation()
        sources.forEach { file ->
            queue.submit(HashWorkAction::class.java) {
                source.set(file)
            }
        }
    }
}

abstract class HashWorkAction : WorkAction<HashParameters> {
    override fun execute() {
        // parameters.source 파일 하나만 처리
        generateHash(parameters.source.get().asFile)
    }
}
```

`noIsolation()`은 가장 가볍지만 같은 클래스 로더를 공유한다. `classLoaderIsolation()`은 클래스 로더를 분리하고, `processIsolation()`은 별도 워커 프로세스에서 실행해 격리 수준을 높인다. 격리가 강해질수록 안정성과 라이브러리 충돌 방지에는 유리하지만 프로세스 생성과 메모리 비용이 추가된다.

워커가 많다고 빌드가 항상 빨라지는 것도 아니다. CPU 코어보다 작업을 많이 만들면 컨텍스트 스위칭이 늘고, 각 워커가 같은 디스크·네트워크·메모리를 두고 경쟁한다. 따라서 작업 수는 `CPU 코어 수`, `작업당 메모리`, `I/O 병목`, `동시 실행해도 안전한지`를 함께 보고 정해야 한다.

### Gradle 워커와 WAS 워커는 다르다

이전 글에서 다룬 WAS의 워커는 들어온 HTTP 요청을 처리하는 실행 프로세스나 스레드를 뜻한다. Gradle 워커는 빌드 중 하나의 task를 처리하는 실행 단위다. 둘 다 “일을 나눠 실행한다”는 공통점은 있지만 생명주기와 실패의 의미가 다르다.

- WAS 워커가 죽으면 서비스 요청을 처리할 다른 워커가 필요하다.
- Gradle 워커가 실패하면 보통 전체 빌드가 실패하고 산출물을 배포하지 않는다.
- WAS 워커는 오래 살아 있는 프로세스일 수 있다.
- Gradle process worker는 한 번의 빌드 동안만 재사용되는 경우가 많다.

이 구분을 해두면 “워커 수를 늘리자”는 말을 들었을 때 무엇의 동시성을 늘리는지 먼저 확인할 수 있다.

## Maven은 예측 가능한 lifecycle이 강점이다

Maven 프로젝트의 핵심은 `pom.xml`이다. `validate`, `compile`, `test`, `package`, `verify`, `install`, `deploy`로 이어지는 표준 lifecycle이 있고, 명령을 실행하면 해당 단계 이전의 단계도 순서대로 실행된다.

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>me.hae02</groupId>
  <artifactId>order-service</artifactId>
  <version>1.0.0</version>

  <properties>
    <maven.compiler.release>21</maven.compiler.release>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
      <version>3.x.x</version>
    </dependency>
  </dependencies>
</project>
```

```bash
./mvnw clean verify
./mvnw dependency:tree
./mvnw spring-boot:run
```

Maven의 장점은 프로젝트를 처음 보는 사람도 실행 단계와 디렉터리 구조를 빠르게 예상할 수 있다는 점이다. 플러그인이 lifecycle의 특정 phase에 연결되고, XML에 선언한 설정이 비교적 명시적이다. 조직 표준이 이미 Maven으로 굳어 있거나 빌드 커스터마이징이 많지 않은 서비스라면 지금도 좋은 선택이다.

단점은 XML이 장황해지기 쉽고, 여러 모듈의 공통 설정이나 조건부 작업을 표현할 때 플러그인 설정이 빠르게 복잡해진다는 점이다. Maven이 기능이 부족해서가 아니라, 선언 구조가 깊어질수록 변경 위치와 실행 순서를 찾는 비용이 커진다.

## Gradle은 task 그래프와 증분 빌드가 중심이다

Gradle에서는 `compileJava`, `test`, `jar`, `build` 같은 task가 있고 task 사이의 의존 관계로 실행 그래프가 만들어진다. 필요한 task만 실행하고, 입력이 바뀌지 않은 작업은 결과를 재사용할 수 있다.

Kotlin DSL을 사용한 최소 예시는 다음과 같다.

```kotlin
plugins {
    java
    id("org.springframework.boot") version "3.x.x"
    id("io.spring.dependency-management") version "1.x.x"
}

group = "me.hae02"
version = "1.0.0"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.test {
    useJUnitPlatform()
}
```

```bash
./gradlew clean build
./gradlew test
./gradlew dependencies --configuration runtimeClasspath
./gradlew bootRun
```

Gradle은 빌드 스크립트가 코드이기 때문에 강력하다. 동시에 그 강력함이 아무 함수나 `build.gradle.kts`에 넣어도 된다는 뜻은 아니다. 빌드 스크립트가 애플리케이션 코드처럼 커지면 task 간 암묵적 의존성과 전역 상태 때문에 원인을 찾기 어려워진다.

## 차이를 한 표로 정리하면

| 관점 | Maven | Gradle |
| --- | --- | --- |
| 기본 모델 | 표준 lifecycle과 phase | task 그래프와 입력·출력 |
| 설정 형식 | XML `pom.xml` | Groovy 또는 Kotlin DSL |
| 빌드 스크립트 | 선언 중심 | 선언 + 프로그래밍 가능 |
| 증분 빌드 | 플러그인과 설정에 의존 | 입력·출력 기반 자동화가 강함 |
| 멀티모듈 | parent·module POM | settings와 subproject |
| 의존성 관리 | dependencyManagement·BOM | version catalog·platform·BOM |
| 학습 곡선 | 규칙이 정해져 있어 낮음 | 초반에는 task/configuration 이해 필요 |
| 커스터마이징 | 플러그인 XML 설정 중심 | convention plugin으로 재사용 가능 |
| 적합한 상황 | 표준화·예측 가능성 우선 | 큰 멀티모듈·빠른 반복·빌드 로직 재사용 |

둘 중 하나가 모든 상황에서 우월한 것은 아니다. 기존 조직의 플러그인, CI 템플릿, 사설 저장소, 운영 담당자의 경험까지 합쳐서 선택해야 한다. 이미 Maven 생태계가 잘 갖춰진 조직에서 “Gradle이 빠르다”는 이유만으로 바꾸면 마이그레이션 비용이 더 클 수 있다.

## Gradle을 쓴다면 Wrapper부터 커밋한다

개발자마다 전역 Gradle 버전이 다르면 같은 소스가 다른 결과를 낼 수 있다. 그래서 Gradle 명령을 직접 `gradle`로 실행하지 않고 프로젝트가 제공하는 Wrapper를 사용한다.

```bash
./gradlew wrapper --gradle-version <조직에서 검증한 버전>
./gradlew --version
./gradlew build
```

저장소에는 다음 파일을 함께 커밋한다.

```text
gradlew
gradlew.bat
gradle/wrapper/gradle-wrapper.jar
gradle/wrapper/gradle-wrapper.properties
```

CI도 `gradle build`가 아니라 `./gradlew build`를 실행해야 로컬과 CI의 Gradle 런타임을 맞출 수 있다. Wrapper의 배포 URL과 체크섬 검증 정책은 조직 보안 규정에 맞게 관리한다.

## Kotlin DSL과 Version Catalog를 기본으로 둔다

Gradle을 새로 시작한다면 Kotlin DSL인 `build.gradle.kts`가 IDE 자동완성과 타입 검사를 받기 쉽다. 의존성 버전을 여러 모듈에서 반복하지 않으려면 `gradle/libs.versions.toml`에 좌표와 버전을 모은다.

```toml
[versions]
spring-boot = "3.x.x"
junit = "5.x.x"

[libraries]
spring-boot-web = { module = "org.springframework.boot:spring-boot-starter-web", version.ref = "spring-boot" }
spring-boot-test = { module = "org.springframework.boot:spring-boot-starter-test", version.ref = "spring-boot" }
junit = { module = "org.junit.jupiter:junit-jupiter", version.ref = "junit" }
```

```kotlin
dependencies {
    implementation(libs.spring.boot.web)
    testImplementation(libs.spring.boot.test)
    testRuntimeOnly(libs.junit)
}
```

Version Catalog는 좌표를 한 곳에서 관리하는 도구다. 여러 라이브러리 버전을 함께 맞춰야 하는 경우에는 BOM이나 Gradle platform을 추가로 사용한다. 카탈로그에 버전을 적었다고 해서 서로 연관된 라이브러리의 호환성이 자동으로 보장되는 것은 아니다.

## 멀티모듈은 루트에 로직을 몰아넣지 않는다

실무 프로젝트가 커지면 `api`, `domain`, `infra`, `batch`처럼 변경 이유가 다른 코드를 모듈로 나누게 된다.

```text
order-service/
├── settings.gradle.kts
├── build.gradle.kts
├── gradle/libs.versions.toml
├── build-logic/
│   └── convention/
├── api/
│   └── build.gradle.kts
├── domain/
│   └── build.gradle.kts
└── infra/
    └── build.gradle.kts
```

```kotlin
// settings.gradle.kts
rootProject.name = "order-service"
include(":api", ":domain", ":infra")
```

```kotlin
// api/build.gradle.kts
dependencies {
    implementation(project(":domain"))
    implementation(libs.spring.boot.web)
}
```

공통 Java 설정과 테스트 설정을 모든 모듈의 `build.gradle.kts`에 복사하면 한 모듈만 다르게 동작하기 시작한다. Gradle 공식 문서가 권장하는 convention plugin을 `build-logic`에 두고, 각 모듈에는 `id("hae02.java-library")`처럼 적용하는 편이 낫다.

```kotlin
// build-logic/src/main/kotlin/hae02.java-library.gradle.kts
plugins {
    `java-library`
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

tasks.withType<Test>().configureEach {
    useJUnitPlatform()
}
```

```kotlin
// domain/build.gradle.kts
plugins {
    id("hae02.java-library")
}
```

`buildSrc`는 시작하기 쉽지만 변경 때마다 별도 빌드 로직이 함께 컴파일된다. 규모가 커지면 독립적인 `build-logic` composite build로 옮겨 경계를 분리하는 것이 관리하기 좋다.

## 의존성은 직접 사용하는 것을 직접 선언한다

A가 B를 사용하고 B가 C를 끌고 온다고 해서 A가 C를 직접 선언하지 않아도 되는 것은 아니다. C의 버전이나 B의 의존성이 바뀌면 A의 컴파일이 갑자기 깨질 수 있다.

```kotlin
dependencies {
    // 코드에서 직접 import하는 라이브러리는 직접 선언
    implementation(libs.jackson.databind)
    implementation(libs.spring.boot.web)
}
```

런타임에만 필요한 의존성은 `runtimeOnly`, 테스트에만 필요한 것은 `testImplementation`으로 범위를 분리한다. `implementation`과 `api`도 구분해야 한다. 라이브러리 모듈의 공개 API 타입에 다른 라이브러리 타입이 노출될 때만 `api`를 사용하고, 내부 구현에서만 사용하면 `implementation`으로 숨긴다.

```kotlin
dependencies {
    api(libs.public.contract)       // 소비자 컴파일 클래스패스에 노출
    implementation(libs.internal.db) // 이 모듈 내부에서만 사용
    runtimeOnly(libs.postgresql)    // 실행 시 필요
    testImplementation(libs.junit)  // 테스트에서만 필요
}
```

## Repository는 넓게 열지 않는다

다음처럼 모든 저장소를 무차별적으로 추가하면 같은 모듈이 다른 저장소에서 내려오거나, 사설 저장소 장애가 전체 빌드를 막을 수 있다.

```kotlin
repositories {
    mavenCentral()
    maven { url = uri("https://repo.example.com/releases") }
}
```

사설 저장소가 있다면 그룹이나 모듈 패턴을 제한하고, 인증 정보는 `build.gradle.kts`에 적지 않는다. 환경 변수나 Gradle properties, CI secret을 사용한다. 의존성 다운로드 로그에 토큰이 출력되지 않는지도 확인한다.

## 캐시와 병렬 실행은 측정하면서 켠다

Gradle에는 up-to-date 검사, 병렬 실행, build cache가 있다.

```properties
# gradle.properties
org.gradle.caching=true
org.gradle.parallel=true
org.gradle.jvmargs=-Xmx2g -Dfile.encoding=UTF-8
```

캐시는 작업의 입력과 출력이 정확하게 선언되어야 안전하다. 시간을 줄이려고 무조건 `clean`을 먼저 실행하면 증분 빌드의 이점을 없애게 된다. 로컬 개발에서는 `./gradlew test`처럼 필요한 task를 실행하고, 릴리스 검증이나 캐시 오염이 의심될 때만 `clean`을 사용한다.

CI에서는 다음처럼 단계별로 목적을 나눈다.

```bash
# 빠른 PR 검증
./gradlew test --no-daemon

# 릴리스 후보 검증
./gradlew clean check build --scan
```

캐시가 잘못된 결과를 재사용하지 않는지 먼저 검증하고 원격 캐시를 공유해야 한다. 작업의 입력에 현재 시각, 외부 파일, 환경 변수 등이 숨어 있으면 캐시 결과가 재현되지 않을 수 있다.

## 내가 권하는 Gradle 사용 순서

1. 프로젝트 Gradle 버전을 Wrapper로 고정한다.
2. `build.gradle.kts`와 `settings.gradle.kts`를 사용한다.
3. `libs.versions.toml`에서 의존성 좌표와 버전을 중앙 관리한다.
4. 모듈 사이의 의존 방향을 먼저 설계하고, 공통 설정은 convention plugin으로 뺀다.
5. 직접 사용하는 의존성을 명시하고 `api` 노출을 최소화한다.
6. 저장소와 credential 범위를 제한한다.
7. `test`, `check`, `build`의 역할을 CI에 고정한다.
8. 캐시와 병렬 실행은 빌드 입력·출력이 올바른지 확인한 뒤 활성화한다.
9. `dependencies`, `dependencyInsight`, Build Scan으로 느린 작업과 충돌을 확인한다.
10. Gradle 설정 코드가 길어지면 애플리케이션 코드처럼 모듈화한다.

Gradle의 장점은 설정을 원하는 만큼 자동화할 수 있다는 데 있다. 하지만 팀이 이해하지 못하는 마법 같은 task를 계속 추가하면 Maven의 장황한 XML보다 유지보수하기 어려운 빌드가 된다. 좋은 Gradle 빌드는 짧은 빌드 파일이 아니라, **의존 방향과 실행 규칙이 드러나고 같은 명령이 어디서나 같은 결과를 내는 빌드**다.

## 참고 자료

- [Gradle Multi-Project Builds](https://docs.gradle.org/current/userguide/multi_project_builds.html)
- [Gradle Version Catalogs](https://docs.gradle.org/current/userguide/version_catalogs.html)
- [Gradle Best Practices for Dependencies](https://docs.gradle.org/current/userguide/best_practices_dependencies.html)
- [Gradle Best Practices for Structuring Builds](https://docs.gradle.org/current/userguide/best_practices_structuring_builds.html)
- [Gradle Worker API](https://docs.gradle.org/current/userguide/worker_api.html)
- [Maven Build Lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)
- [Maven Dependency Mechanism](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html)
