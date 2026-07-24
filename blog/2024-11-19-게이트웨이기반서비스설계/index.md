---
slug: gateway-structure
title: 앱 서버가 죽어도 점검 화면은 떠야 한다 - 게이트웨이 기반 서비스 점검 모드 설계
authors:
  - haeyoung
tags:
  - 게이트웨이
  - nginx
  - Service
---
서비스를 운영하다 보면 DB 마이그레이션, 서버 교체, 대규모 배포 등의 이유로 일정 시간 동안 사용자 요청을 차단해야 할 때가 있다.

가장 먼저 떠올릴 수 있는 방법은 애플리케이션 서버에서 점검 상태를 확인하고, 점검 중이라면 `503 Service Unavailable` 응답을 반환하는 것이다.

예를 들어 Spring Boot에서는 필터나 인터셉터를 사용해 다음과 같이 구현할 수 있다.

```java
@Component
public class MaintenanceInterceptor implements HandlerInterceptor {

    private final MaintenanceService maintenanceService;

    public MaintenanceInterceptor(
            MaintenanceService maintenanceService
    ) {
        this.maintenanceService = maintenanceService;
    }

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) throws IOException {

        if (!maintenanceService.isMaintenanceMode()) {
            return true;
        }

        response.setStatus(
                HttpServletResponse.SC_SERVICE_UNAVAILABLE
        );
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.getWriter().write("""
                {
                  "code": "MAINTENANCE",
                  "message": "현재 서비스 점검 중입니다.",
                  "end_at": "2026-07-25T03:00:00+09:00"
                }
                """);

        return false;
    }
}
```

이 방식은 구현하기 쉽고, 관리자가 데이터베이스나 관리 API를 통해 점검 모드를 변경할 수도 있다.

하지만 여기에는 중요한 문제가 있다.

애플리케이션 서버가 죽어 있으면 점검 응답도 반환할 수 없다.

점검 중 Spring Boot 프로세스를 종료하거나 전체 컨테이너를 재배포한다면, 사용자는 점검 안내가 아니라 연결 실패나 타임아웃을 보게 된다.

따라서 서비스 전체를 차단하는 점검 기능은 애플리케이션 서버보다 앞단에 있는 게이트웨이 계층에서 처리하는 것이 더 안전하다.

---

## **1. 점검 모드를 애플리케이션에 두면 생기는 문제**

애플리케이션에서 점검 모드를 처리하는 구조는 다음과 같다.

```text
Client
  ↓
Gateway
  ↓
Application
  ↓
MaintenanceInterceptor
  ↓
503 MAINTENANCE
```

점검 응답을 만들기 위해 반드시 애플리케이션까지 요청이 도달해야 한다.

따라서 다음과 같은 작업이 진행되면 점검 응답 자체를 반환할 수 없다.

- 애플리케이션 프로세스 종료
- 전체 컨테이너 또는 Pod 재배포
- 애플리케이션 기동 실패
- JVM 장애
- DB 연결 실패로 인한 요청 처리 불가
- 잘못된 설정으로 인한 서버 부팅 실패
- 네트워크 정책 변경으로 인한 앱 서버 접근 실패

실제 점검은 애플리케이션이 정상적으로 살아 있는 상태에서만 진행되는 것이 아니다.

오히려 서버를 내리거나 데이터베이스 구조를 변경하기 위해 점검을 수행하는 경우가 많다.

따라서 전면 점검 기능이 애플리케이션 서버에 의존하면 점검 목적과 구현 위치가 서로 충돌한다.

---

## **2. 게이트웨이 계층에서 요청을 차단한다**

권장 구조는 Nginx, Ingress Gateway, API Gateway 또는 Load Balancer처럼 애플리케이션보다 앞에 있는 계층에서 요청을 차단하는 것이다.

```text
Client
  ↓
Gateway
  ├─ 정상 모드 → Application
  └─ 점검 모드 → 503 MAINTENANCE
```

점검 모드가 활성화되면 게이트웨이는 요청을 애플리케이션으로 전달하지 않고 즉시 응답한다.

```http
HTTP/1.1 503 Service Unavailable
Content-Type: application/json
Cache-Control: no-store
Retry-After: 1800
```

```json
{
  "code": "MAINTENANCE",
  "message": "서비스 안정화를 위한 점검이 진행 중입니다.",
  "start_at": "2026-07-25T01:00:00+09:00",
  "end_at": "2026-07-25T03:00:00+09:00"
}
```

이 구조에서는 애플리케이션 서버가 종료되어 있어도 게이트웨이가 살아 있다면 점검 안내를 반환할 수 있다.

또한 요청이 애플리케이션까지 전달되지 않으므로 점검 중 데이터 변경 요청이 들어오는 것도 방지할 수 있다.

---

## 

## 

## **3. 왜**

**`503 Service Unavailable`**

**을 사용해야 할까**

점검 응답을 `200 OK`로 반환하는 구현도 볼 수 있지만, 운영 관점에서는 적절하지 않다.

```http
HTTP/1.1 200 OK
```

```json
{
  "code": "MAINTENANCE"
}
```

HTTP 상태만 보면 요청이 성공한 것처럼 보이기 때문이다.

이 경우 다음과 같은 문제가 발생할 수 있다.

- 모니터링 시스템이 서비스를 정상 상태로 판단한다.
- API 성공률 통계가 왜곡된다.
- 클라이언트 성공 처리 로직이 실행될 수 있다.
- 프록시나 CDN이 정상 응답으로 캐싱할 수 있다.
- 장애 감지가 늦어질 수 있다.

점검 중에는 서버가 의도적으로 요청을 처리할 수 없는 상태이므로 `503 Service Unavailable`이 의미상 적절하다.

```http
HTTP/1.1 503 Service Unavailable
Retry-After: 1800
```

`Retry-After` 헤더를 사용하면 클라이언트에게 재시도 시점을 안내할 수도 있다.

값은 초 단위로 지정할 수 있다.

```http
Retry-After: 1800
```

또는 HTTP 날짜 형식으로 지정할 수도 있다.

```http
Retry-After: Sat, 25 Jul 2026 03:00:00 GMT
```

다만 모바일 앱이 `Retry-After` 값에 맞춰 모든 기기에서 동시에 재시도하면 점검 종료 직후 트래픽이 몰릴 수 있다.

따라서 자동 재시도를 구현한다면 지수 백오프와 랜덤 지연을 함께 적용하는 것이 좋다.

---

## **4. Nginx에서 점검 응답 반환하기**

가장 단순한 구현은 Nginx 설정에서 바로 `503`을 반환하는 것이다.

```nginx
server {
    listen 443 ssl;
    server_name api.example.com;

    location / {
        default_type application/json;

        add_header Cache-Control "no-store" always;
        add_header Retry-After "1800" always;

        return 503 '{
          "code": "MAINTENANCE",
          "message": "현재 서비스 점검 중입니다.",
          "start_at": "2026-07-25T01:00:00+09:00",
          "end_at": "2026-07-25T03:00:00+09:00"
        }';
    }
}
```

점검 시작 시 설정을 변경하고 Nginx를 reload한다.

```bash
nginx -t && nginx -s reload
```

여기서 반드시 `nginx -t`로 설정 문법을 먼저 검증해야 한다.

검증하지 않고 reload하면 잘못된 설정으로 인해 게이트웨이 자체에 문제가 발생할 수 있다.

운영에서는 정상 설정과 점검 설정을 별도로 관리하는 방법이 안전하다.

```text
/etc/nginx/conf.d/
├── app-normal.conf
├── app-maintenance.conf
└── app-enabled.conf
```

점검 시작 시 심볼릭 링크를 점검 설정으로 변경한다.

```bash
ln -sfn \
  /etc/nginx/conf.d/app-maintenance.conf \
  /etc/nginx/conf.d/app-enabled.conf

nginx -t && nginx -s reload
```

점검 종료 시 정상 설정으로 되돌린다.

```bash
ln -sfn \
  /etc/nginx/conf.d/app-normal.conf \
  /etc/nginx/conf.d/app-enabled.conf

nginx -t && nginx -s reload
```

이 정도 규모라면 자동화하지 않고 담당자가 점검 시작과 종료 시 직접 실행해도 된다.

다만 수동 작업이라도 명령어를 직접 타이핑하기보다는 검증이 포함된 스크립트로 관리하는 것이 안전하다.

```bash
#!/usr/bin/env bash

set -euo pipefail

MODE="${1:-}"

NORMAL_CONF="/etc/nginx/conf.d/app-normal.conf"
MAINTENANCE_CONF="/etc/nginx/conf.d/app-maintenance.conf"
ENABLED_CONF="/etc/nginx/conf.d/app-enabled.conf"

case "$MODE" in
  on)
    TARGET="$MAINTENANCE_CONF"
    ;;
  off)
    TARGET="$NORMAL_CONF"
    ;;
  *)
    echo "Usage: $0 {on|off}"
    exit 1
    ;;
esac

ln -sfn "$TARGET" "$ENABLED_CONF"

if nginx -t; then
  nginx -s reload
  echo "Maintenance mode: $MODE"
else
  echo "Nginx configuration validation failed."
  exit 1
fi
```

---

## **5. JSON을 Nginx 설정에 직접 작성해도 될까**

간단한 서비스라면 설정 파일에 JSON을 직접 작성해도 된다.

하지만 다음 정보가 자주 변경된다면 별도의 정적 JSON 파일로 관리하는 것이 낫다.

- 점검 시작 시각
- 예상 종료 시각
- 점검 연장 여부
- 다국어 메시지
- 고객센터 URL
- 앱 업데이트 안내
- 점검 상세 설명

예를 들어 다음과 같은 JSON 파일을 준비할 수 있다.

```json
{
  "code": "MAINTENANCE",
  "message": {
    "ko": "현재 서비스 점검 중입니다.",
    "en": "The service is currently under maintenance."
  },
  "start_at": "2026-07-25T01:00:00+09:00",
  "end_at": "2026-07-25T03:00:00+09:00",
  "status_url": "https://status.example.com"
}
```

그리고 Nginx가 이 파일을 반환하게 만든다.

```nginx
location = /maintenance.json {
    root /var/www/system;
    default_type application/json;

    add_header Cache-Control "no-store" always;
}

location / {
    error_page 503 =503 /maintenance.json;
    return 503;
}
```

실제 운영 환경에서는 내부 리다이렉트 결과가 반드시 `503`으로 유지되는지 확인해야 한다.

설정 방식에 따라 정적 파일 응답이 `200`으로 변경될 수 있기 때문에 배포 전에 다음 항목을 검증해야 한다.

```bash
curl -i https://api.example.com/api/users
```

기대 결과는 다음과 같다.

```http
HTTP/1.1 503 Service Unavailable
Content-Type: application/json
Cache-Control: no-store
```

---

## **6. 클라이언트가 점검 화면을 직접 그린다**

모바일 앱이나 SPA에서는 게이트웨이가 HTML 점검 페이지를 내려주기보다, 상태 코드와 에러 코드를 보고 클라이언트가 내장된 화면을 그리는 방식이 좋다.

```text
503 + MAINTENANCE
        ↓
앱 내부 전면 점검 화면
```

이 방식의 장점은 다음과 같다.

- 앱 디자인과 동일한 점검 화면을 제공할 수 있다.
- 다국어 처리가 쉽다.
- 앱 버전별 맞춤 안내가 가능하다.
- 네이티브 버튼과 링크를 사용할 수 있다.
- 서버가 HTML을 렌더링할 필요가 없다.

안드로이드 클라이언트에서는 다음처럼 처리할 수 있다.

```kotlin
data class ApiErrorResponse(
    val code: String?,
    val message: String?,
    val startAt: String?,
    val endAt: String?,
    val statusUrl: String?
)
```

```kotlin
suspend fun <T> handleResponse(
    response: Response<T>
): T {
    if (response.isSuccessful) {
        return requireNotNull(response.body())
    }

    val errorBody = parseErrorBody(response)

    if (
        response.code() == 503 &&
        errorBody?.code == "MAINTENANCE"
    ) {
        throw MaintenanceException(
            message = errorBody.message,
            startAt = errorBody.startAt,
            endAt = errorBody.endAt
        )
    }

    throw ApiException(
        status = response.code(),
        code = errorBody?.code
    )
}
```

화면 계층에서는 예외를 받아 점검 화면으로 전환한다.

```kotlin
when (throwable) {
    is MaintenanceException -> {
        navigator.navigate(
            MaintenanceRoute(
                message = throwable.message,
                startAt = throwable.startAt,
                endAt = throwable.endAt
            )
        )
    }

    else -> {
        showTemporaryError()
    }
}
```

---

## 

## 

## **7. 모든**

**`503`**

**을 점검으로 처리하면 안 된다**

여기서 중요한 점이 있다.

`503 Service Unavailable`은 계획 점검에서만 발생하는 상태 코드가 아니다.

다음 상황에서도 `503`이 반환될 수 있다.

- 업스트림 애플리케이션 전체 장애
- 서버 과부하
- 정상 인스턴스가 하나도 없는 상태
- 배포 중 일시적인 대상 제거
- 요청 제한 또는 서킷 브레이커 동작
- 게이트웨이 내부 정책에 의한 차단

따라서 상태 코드만 보고 점검 화면을 띄우면 안 된다.

```kotlin
// 잘못된 처리
if (response.code() == 503) {
    showMaintenanceScreen()
}
```

HTTP 상태와 비즈니스 에러 코드를 함께 확인해야 한다.

```kotlin
if (
    response.code() == 503 &&
    errorBody.code == "MAINTENANCE"
) {
    showMaintenanceScreen()
}
```

오류는 다음처럼 분류하는 것이 좋다.

```text
503 + MAINTENANCE
→ 계획된 점검 화면

503 + OVER_CAPACITY
→ 서비스 혼잡 화면

502 / 504
→ 서버 연결 장애 화면

Timeout / DNS / Offline
→ 사용자 네트워크 확인 화면

기타 5xx
→ 일시적인 서비스 오류 화면
```

---

## **8. 점검 화면과 일반 장애 화면은 달라야 한다**

계획 점검과 비계획 장애는 사용자에게 다른 메시지를 보여줘야 한다.

### **계획 점검**

```text
서비스 안정화를 위한 점검이 진행 중입니다.

예상 종료 시각
2026년 7월 25일 오전 3시

완료되는 대로 서비스를 다시 이용하실 수 있습니다.
```

### **서버 장애**

```text
현재 서비스 연결이 원활하지 않습니다.

잠시 후 다시 시도해주세요.
문제가 계속되면 고객센터로 문의해주세요.
```

### **사용자 네트워크 장애**

```text
인터넷 연결을 확인해주세요.

Wi-Fi 또는 모바일 데이터 연결 상태를 확인한 후
다시 시도해주세요.
```

서버가 점검 응답을 반환하지 못하는 최악의 상황에서도 앱은 자체적으로 일반 장애 화면을 보여줄 수 있어야 한다.

---

## **9. 게이트웨이 서버 자체가 죽으면 어떻게 할까**

Nginx 한 대만 운영한다면 Nginx가 단일 장애점이 된다.

```text
Client
  ↓
Nginx 한 대
  ↓
Application
```

이 구조에서 Nginx가 죽으면 점검 JSON도 반환할 수 없다.

클라이언트에는 다음과 같은 오류가 보일 수 있다.

- Connection refused
- Connection timeout
- TLS 연결 실패
- 502 Bad Gateway
- 504 Gateway Timeout

따라서 운영 서비스에서는 게이트웨이를 다중화하는 것이 일반적이다.

```text
                 ┌─ Nginx A ─ Application
Load Balancer ───┤
                 └─ Nginx B ─ Application
```

한쪽 Nginx가 비정상이라면 로드밸런서가 해당 인스턴스를 제외한다.

더 나아가 클라우드 환경에서는 관리형 로드밸런서 자체에서 점검 응답을 반환할 수도 있다.

```text
Client
  ↓
Managed Load Balancer
  ├─ 정상 모드 → Nginx → Application
  └─ 점검 모드 → Fixed 503 Response
```

이 경우 Nginx와 애플리케이션이 모두 내려가더라도 관리형 로드밸런서가 점검 응답을 반환할 수 있다.

---

## **10. CDN 또는 Edge 계층에서 처리하는 방법**

더 높은 가용성이 필요하다면 CDN이나 Edge 계층에서 점검 응답을 반환할 수 있다.

```text
Client
  ↓
CDN / Edge
  ↓
Load Balancer
  ↓
Nginx
  ↓
Application
```

점검 응답용 JSON이나 HTML은 애플리케이션 서버와 다른 저장소에 둬야 한다.

```text
서비스 Origin
- Load Balancer
- Nginx
- Spring Boot

점검 안내 Origin
- 별도 Object Storage
- maintenance.json
- maintenance.html
```

점검 안내 파일이 애플리케이션과 같은 서버에 있다면 애플리케이션 서버 장애 시 해당 파일에도 접근할 수 없다.

따라서 장애 안내 리소스는 가능한 한 서비스 본체와 장애 영역을 분리하는 것이 좋다.

---

## **11. 게이트웨이까지 전부 응답하지 못하면?**

완벽하게 죽지 않는 서버는 없다.

다음 계층 중 하나라도 문제가 생길 수 있다.

- DNS
- CDN
- Load Balancer
- Nginx
- TLS 인증서
- 클라우드 리전
- 통신사 네트워크
- 사용자의 Wi-Fi
- 모바일 데이터 연결

따라서 클라이언트에는 최종 fallback 화면이 필요하다.

```text
명시적인 MAINTENANCE 응답 수신
→ 계획 점검 화면

서버 응답은 있지만 502·503·504
→ 일시적인 서버 장애 화면

서버 응답 자체가 없음
→ 네트워크 또는 서비스 연결 장애 화면
```

즉, 게이트웨이 점검 모드는 높은 확률로 정확한 점검 화면을 보여주기 위한 수단이지, 모든 장애 상황에서 점검 상태를 전달할 수 있다는 보장은 아니다.

---

## **12. 헬스 체크 경로는 따로 관리해야 한다**

점검 모드에서 모든 요청을 차단하면 로드밸런서 헬스 체크까지 `503`을 받을 수 있다.

그러면 로드밸런서는 Nginx 자체가 죽었다고 판단하고 모든 게이트웨이를 대상에서 제거할 수 있다.

따라서 게이트웨이 상태 확인용 경로는 점검 중에도 열어두는 것이 좋다.

```nginx
location = /gateway-health {
    access_log off;
    default_type application/json;

    return 200 '{"status":"UP"}';
}
```

사용자 요청에는 `503`을 반환한다.

```nginx
location / {
    default_type application/json;

    return 503 '{
      "code": "MAINTENANCE",
      "message": "현재 서비스 점검 중입니다."
    }';
}
```

이렇게 하면 두 상태를 구분할 수 있다.

```text
/gateway-health
→ Nginx 프로세스가 살아 있는가

/api/**
→ 사용자가 서비스를 이용할 수 있는가
```

운영 모니터링에서도 다음 지표를 분리하는 것이 좋다.

```text
Infrastructure Health
- Gateway process
- Load balancer target
- TLS certificate
- CPU and memory

Service Availability
- 사용자 API 정상 응답 여부
- 점검 모드 여부
- 주요 기능 정상 동작 여부
```

---

## **13. 모든 API를 막을 필요는 없다**

전면 점검 중에도 일부 경로는 허용할 수 있다.

예를 들면 다음과 같다.

- 앱 버전 확인
- 시스템 상태 조회
- 공지사항
- 고객센터 정보
- 점검 상태 조회
- 로그아웃
- 정적 리소스

```nginx
location = /api/system/status {
    proxy_pass http://application;
}

location = /api/app/version {
    proxy_pass http://application;
}

location /api/ {
    default_type application/json;

    return 503 '{
      "code": "MAINTENANCE",
      "message": "현재 서비스 점검 중입니다."
    }';
}
```

하지만 애플리케이션 서버를 완전히 종료한다면 허용한 API도 사용할 수 없다.

이런 정보가 점검 중에도 반드시 필요하다면 별도의 정적 파일이나 경량 상태 서버에서 제공해야 한다.

---

## **14. 관리자와 내부 트래픽 예외 처리**

점검 중에도 운영자가 실제 서버 상태를 확인해야 할 수 있다.

이 경우 내부 IP나 VPN을 통해서만 애플리케이션 접근을 허용할 수 있다.

```nginx
location /internal/ {
    allow 10.0.0.0/8;
    deny all;

    proxy_pass http://application;
}
```

또는 특정 헤더를 사용하는 방법도 생각할 수 있다.

```nginx
map $http_x_maintenance_bypass $maintenance_bypass {
    default 0;
    "secret-value" 1;
}
```

하지만 고정된 비밀 헤더는 유출 가능성이 있고 로그에 남을 수 있으므로 권장하기 어렵다.

가능하면 다음 방법을 우선하는 것이 좋다.

- VPN 내부 접근
- 관리망 IP 허용
- 별도 내부 도메인
- 인증된 운영자 전용 게이트웨이
- Bastion 또는 사내 네트워크 이용

---

## **15. 점검 응답 캐싱에 주의해야 한다**

점검 중 반환한 `503` 응답이 CDN이나 프록시에 캐싱되면 점검이 끝난 뒤에도 사용자가 계속 점검 화면을 볼 수 있다.

따라서 점검 응답에는 캐시 방지 헤더를 넣는 것이 좋다.

```http
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
Expires: 0
```

Nginx에서는 다음처럼 설정할 수 있다.

```nginx
add_header Cache-Control \
  "no-store, no-cache, must-revalidate" always;

add_header Pragma "no-cache" always;
add_header Expires "0" always;
```

CDN에서 오류 응답을 캐싱하도록 구성했다면 점검 종료 절차에 다음 작업을 포함해야 한다.

- Error caching TTL 확인
- 점검 JSON 캐시 무효화
- CDN invalidation
- 외부 네트워크에서 정상 응답 확인

---

## **16. 점검 종료 시각은 신중하게 제공한다**

사용자에게 종료 시각을 안내하는 것은 좋지만, 해당 시각을 지키지 못하면 오히려 신뢰를 잃을 수 있다.

종료 시각이 확실하지 않다면 `null`로 내려주는 것도 방법이다.

```json
{
  "code": "MAINTENANCE",
  "message": "현재 서비스 점검 중입니다.",
  "end_at": null
}
```

클라이언트에서는 값이 있을 때만 표시한다.

```kotlin
if (maintenance.endAt != null) {
    showEstimatedEndTime(maintenance.endAt)
} else {
    hideEstimatedEndTime()
}
```

점검이 연장되었다면 안내 메시지를 갱신할 수 있어야 한다.

```json
{
  "code": "MAINTENANCE",
  "message": "점검 작업이 예상보다 길어지고 있습니다.",
  "end_at": "2026-07-25T04:00:00+09:00",
  "extended": true
}
```

---

## **17. 점검 모드와 읽기 전용 모드는 다르다**

모든 점검에서 전체 서비스를 차단할 필요는 없다.

DB 마이그레이션이나 데이터 정합성 작업에 따라 읽기 요청은 허용하고 쓰기 요청만 차단할 수 있다.

```text
GET 요청
→ 허용

POST / PUT / PATCH / DELETE
→ 503 또는 423 응답
```

Nginx에서는 요청 메서드를 기준으로 차단할 수 있다.

```nginx
location /api/ {
    if ($request_method !~ ^(GET|HEAD|OPTIONS)$) {
        return 503 '{
          "code": "READ_ONLY_MAINTENANCE",
          "message": "점검 중에는 조회만 가능합니다."
        }';
    }

    proxy_pass http://application;
}
```

다만 Nginx의 `if` 사용에는 주의가 필요하며, 복잡한 정책은 `map`이나 별도의 location 구성을 활용하는 편이 좋다.

읽기 전용 점검은 사용자 경험을 개선할 수 있지만 다음 조건이 필요하다.

- 읽기 요청이 DB 변경 없이 안전해야 한다.
- 오래된 데이터를 보여줘도 문제가 없어야 한다.
- 캐시나 복제본을 활용할 수 있어야 한다.
- 조회 과정에서 쓰기 작업이 발생하지 않아야 한다.
- 로그인 세션 갱신처럼 숨겨진 쓰기가 없어야 한다.

---

## **18. 장기 작업은 점검 전에 차단해야 한다**

점검 모드를 켜는 순간 신규 요청은 차단할 수 있지만, 이미 처리 중인 요청은 남아 있을 수 있다.

예를 들어 다음 작업이 진행 중일 수 있다.

- 결제 승인
- 파일 업로드
- 대용량 데이터 처리
- 예약 생성
- 배치 작업
- 메시지 큐 소비
- 외부 API 연동

따라서 점검 절차에는 요청 드레이닝이 필요하다.

```text
1. 신규 쓰기 요청 차단
2. 진행 중인 요청 완료 대기
3. 메시지 소비 중단
4. 배치 작업 상태 확인
5. 애플리케이션 종료
6. DB 또는 인프라 작업 수행
```

쿠버네티스 환경이라면 readiness probe를 먼저 실패시키고, 기존 연결이 정리될 시간을 확보한 뒤 Pod를 종료하는 방식을 사용할 수 있다.

애플리케이션에서도 graceful shutdown 설정을 적용하는 것이 좋다.

```yaml
server:
  shutdown: graceful

spring:
  lifecycle:
    timeout-per-shutdown-phase: 30s
```

게이트웨이의 점검 모드는 요청 유입을 막는 기능이고, 이미 진행 중인 트랜잭션을 안전하게 종료해주는 기능은 아니다.

---

## **19. WebSocket과 SSE도 고려해야 한다**

일반 HTTP 요청만 막아도 기존 WebSocket이나 SSE 연결은 계속 유지될 수 있다.

```text
점검 모드 활성화
  ↓
신규 HTTP 요청 차단
  ↓
기존 WebSocket 연결은 계속 살아 있음
```

실시간 서비스를 운영한다면 다음 정책을 별도로 정해야 한다.

- 점검 시작 전에 연결 종료 메시지 전송
- 특정 close code 사용
- 클라이언트 재연결 중단
- 점검 종료 예정 시각 전달
- SSE 재연결 간격 증가

클라이언트가 연결 종료 후 무한 재접속하면 점검 중 게이트웨이에 불필요한 트래픽이 계속 발생할 수 있다.

따라서 점검 코드가 전달되면 일정 시간 동안 자동 재연결을 중지해야 한다.

---

## **20. 구버전 앱도 고려해야 한다**

새 버전 앱은 `MAINTENANCE` 코드를 이해하지만, 구버전 앱은 해당 코드를 모를 수 있다.

따라서 클라이언트는 알 수 없는 서버 오류도 안전하게 처리해야 한다.

```kotlin
when {
    status == 503 &&
        code == "MAINTENANCE" -> {
        showMaintenanceScreen()
    }

    status in 500..599 -> {
        showTemporaryServiceError()
    }

    else -> {
        showGenericError()
    }
}
```

서버에서도 오래된 앱을 고려해 `message` 필드를 함께 내려주는 것이 좋다.

```json
{
  "code": "MAINTENANCE",
  "message": "현재 서비스 점검 중입니다.",
  "end_at": "2026-07-25T03:00:00+09:00"
}
```

---

## **21. 인증 실패와 점검 응답의 우선순위**

점검 중 만료된 토큰으로 요청하면 어떤 응답을 반환해야 할까?

```text
401 Unauthorized
또는
503 Maintenance
```

전면 점검이라면 일반적으로 인증보다 점검 응답을 먼저 반환하는 편이 사용자 경험에 좋다.

그렇지 않으면 앱이 점검 중에도 토큰 갱신을 시도하고, 로그인 화면으로 이동하거나 반복 요청을 발생시킬 수 있다.

```text
Client
  ↓
Gateway maintenance check
  ├─ 점검 중 → 503 MAINTENANCE
  └─ 정상 → Authentication
```

다만 관리자 전용 API나 내부 운영 API는 별도 인증과 우회 정책을 적용해야 한다.

---

## **22. CORS 헤더도 놓치면 안 된다**

웹 프론트엔드가 별도 도메인에서 API를 호출한다면 점검 응답에도 CORS 헤더가 있어야 한다.

정상 요청은 애플리케이션이 CORS 헤더를 추가하지만, 점검 응답은 Nginx가 직접 반환하기 때문에 헤더가 빠질 수 있다.

```nginx
add_header Access-Control-Allow-Origin \
  "https://app.example.com" always;

add_header Access-Control-Allow-Credentials \
  "true" always;

add_header Access-Control-Allow-Headers \
  "Authorization, Content-Type" always;

add_header Access-Control-Allow-Methods \
  "GET, POST, PUT, PATCH, DELETE, OPTIONS" always;
```

CORS 헤더가 없으면 브라우저에서 응답 본문을 읽지 못하고 단순 네트워크 오류처럼 처리될 수 있다.

특히 `always` 옵션을 사용하지 않으면 `503` 응답에 헤더가 붙지 않을 수 있으므로 주의해야 한다.

---

## **23. OPTIONS 요청 처리도 필요하다**

브라우저는 실제 API 호출 전에 CORS preflight 요청을 보낼 수 있다.

```http
OPTIONS /api/orders
```

점검 중 OPTIONS 요청도 `503`으로 막으면 브라우저가 실제 응답의 에러 코드를 읽지 못할 수 있다.

따라서 웹 클라이언트가 있다면 OPTIONS 요청은 정상 응답을 주고, 실제 요청에서 점검 응답을 반환하는 방식도 고려할 수 있다.

```nginx
if ($request_method = OPTIONS) {
    add_header Access-Control-Allow-Origin \
      "https://app.example.com" always;

    add_header Access-Control-Allow-Methods \
      "GET, POST, PUT, PATCH, DELETE, OPTIONS" always;

    add_header Access-Control-Allow-Headers \
      "Authorization, Content-Type" always;

    return 204;
}
```

모바일 앱만 사용하는 서비스라면 CORS 처리가 필요하지 않을 수 있다.

---

## **24. 점검 모드 자체를 모니터링해야 한다**

점검 모드가 활성화되면 일반 장애 모니터링이 계속 울릴 수 있다.

```text
API 성공률 하락
5xx 증가
헬스 체크 실패
사용자 요청 실패
```

계획된 점검과 실제 장애를 구분할 수 있도록 모니터링에 점검 상태를 전달하는 것이 좋다.

예를 들면 다음과 같은 메트릭을 둘 수 있다.

```text
service_maintenance_mode{service="api"} 1
```

점검 중에는 일부 알림을 억제하되, 다음 알림은 유지해야 한다.

- 게이트웨이 자체 장애
- 점검 종료 시각 초과
- 점검 모드 해제 실패
- 데이터베이스 작업 실패
- Nginx 설정 reload 실패
- CDN 또는 Load Balancer 오류
- 관리자 접근 경로 장애

점검 중이라고 모든 알림을 꺼버리면 실제 인프라 장애를 놓칠 수 있다.

---

## **25. 수동 점검 모드도 운영 절차가 필요하다**

점검 시작과 종료를 수동으로 처리하는 것 자체는 문제가 아니다.

빈도가 낮고 담당자가 명확하다면 자동화보다 수동 전환이 더 단순하고 안전할 수도 있다.

다만 다음과 같은 운영 절차는 필요하다.

### **점검 시작 전**

- 점검 응답 JSON 검토
- 시작·종료 시각 확인
- Nginx 설정 검증
- 점검 해제 명령 준비
- 관리자 접근 경로 확인
- 모바일 및 웹 화면 확인
- 모니터링 알림 정책 확인
- 진행 중 작업과 배치 상태 확인

### **점검 시작**

- 신규 쓰기 요청 차단
- 진행 중 요청 종료 대기
- 점검 모드 활성화
- 외부 네트워크에서 `503` 확인
- 앱의 점검 화면 확인
- 애플리케이션 요청 유입 중단 확인

### **점검 종료 전**

- 애플리케이션 health check 확인
- 주요 API smoke test
- DB 마이그레이션 검증
- 메시지 큐와 배치 상태 확인
- 로그에서 반복 오류 확인

### **점검 종료**

- 점검 모드 해제
- 외부 네트워크에서 `200` 확인
- 앱 재진입 확인
- CDN 캐시 확인
- 모니터링 알림 정상화
- 점검 결과 기록

수동 작업에서 가장 흔한 문제는 점검 모드를 켜는 것이 아니라 끄는 것을 잊는 것이다.

따라서 종료 예정 시각이 지나도 점검 모드가 유지되면 알림을 보내도록 구성하는 것이 좋다.

---

## **26. 최종 권장 아키텍처**

소규모 서비스라면 다음 구조로도 충분하다.

```text
Client
  ↓
Nginx
  ├─ 정상 모드 → Spring Boot
  └─ 점검 모드 → 503 JSON
```

다만 Nginx 한 대가 단일 장애점이라는 한계가 있다.

일반적인 운영 환경에서는 다음 구조가 더 안전하다.

```text
Client
  ↓
Managed Load Balancer
  ↓
Nginx A / Nginx B
  ↓
Spring Boot Instances
```

더 높은 가용성이 필요한 서비스라면 다음처럼 구성할 수 있다.

```text
Client
  ↓
CDN / Edge
  ↓
Managed Load Balancer
  ↓
Nginx or Kubernetes Ingress
  ↓
Spring Boot
```

점검 응답을 어느 계층에서 반환할지는 서비스 규모와 장애 허용 범위에 따라 결정한다.

```text
Nginx
- 구현이 단순하다.
- 애플리케이션과 분리할 수 있다.
- 단일 인스턴스라면 장애점이 된다.

Managed Load Balancer
- 애플리케이션과 Nginx 장애에 영향을 덜 받는다.
- 관리형 고가용성을 활용할 수 있다.
- 복잡한 응답 형식에는 제약이 있을 수 있다.

CDN / Edge
- 가장 앞단에서 빠르게 응답할 수 있다.
- 원본 서버 전체 장애에도 대응하기 좋다.
- 캐싱과 설정 배포 정책을 신중하게 관리해야 한다.
```

---

## **마무리**

전면 서비스 점검 안내를 애플리케이션 서버에서만 처리하면 애플리케이션이 죽었을 때 점검 안내도 함께 사라진다.

따라서 계획된 전면 점검은 애플리케이션보다 앞에 있는 게이트웨이, 로드밸런서 또는 CDN 계층에서 처리하는 것이 안전하다.

핵심 원칙은 다음과 같다.

1. 점검 응답은 `503 Service Unavailable`로 반환한다.
2. `MAINTENANCE` 같은 명시적인 에러 코드를 함께 제공한다.
3. 클라이언트는 상태 코드와 에러 코드를 함께 확인한다.
4. 점검 화면은 클라이언트에 내장하고 응답 정보만 활용한다.
5. 모든 `503`을 계획 점검으로 취급하지 않는다.
6. 게이트웨이는 다중화하거나 관리형 로드밸런서를 사용한다.
7. 게이트웨이까지 실패하면 클라이언트의 일반 장애 화면을 사용한다.
8. 점검 응답이 캐싱되지 않도록 관리한다.
9. 헬스 체크와 내부 운영 경로는 별도로 설계한다.
10. 진행 중 요청, WebSocket, 배치, 메시지 큐까지 함께 고려한다.
11. 수동 전환이라도 검증과 복구 절차를 스크립트로 관리한다.
12. 점검 모드의 종료 지연과 해제 실패도 모니터링한다.

점검 모드는 단순히 사용자에게 안내 문구를 보여주는 기능이 아니다.

점검 중 신규 트래픽을 안전하게 차단하고, 진행 중인 작업을 정리하며, 서버가 내려간 상태에서도 사용자에게 일관된 경험을 제공하기 위한 운영 장치다.

결국 중요한 것은 “점검 화면을 어디서 보여줄 것인가”보다 다음 질문에 답하는 것이다.

현재 점검 응답을 담당하는 계층이 죽더라도, 그보다 앞단에서 사용자를 보호할 수 있는가?

이 질문을 반복하면서 장애 영역을 한 계층씩 분리하는 것이 실제 운영 서비스의 점검 설계다.