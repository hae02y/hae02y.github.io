---
slug: timezone
title: 타임존 완전 정리 - UTC부터 DB, 애플리케이션, 인프라까지
authors:
  - haeyoung
tags:
  - Backend
  - Database
  - Infra
  - Java
---
타임존은 몇 번을 정리해도 다음에 또 헷갈린다. 서버 시간은 UTC인데 DB는 KST고 애플리케이션은 또 다른 값을 뱉는 상황이 되면, 어디서부터 손을 대야 할지 감이 안 온다. 이번에 개념부터 저장·전달·표시까지 한 번에 정리해두고, 다음부터는 여기만 다시 보기로 했다.

### 왜 이렇게 헷갈리는가

시간을 다루는 값이 사실은 **세 가지 다른 종류**인데, 우리는 이걸 전부 "날짜시간"이라는 한 단어로 부르기 때문이다.

| 종류 | 정체 | 예시 | 저장 방식 |
|------|------|------|----------|
| **시점(instant)** | 우주에서 딱 한 번뿐인 순간 | 결제 완료 시각, 로그 발생 시각 | UTC(또는 epoch) |
| **벽시계 시각(wall clock)** | 달력과 시계에 적힌 값 | "9월 3일 오후 2시에 회의" | 로컬 시각 + 타임존 ID |
| **날짜/시간 그 자체** | 시점과 무관한 값 | 생일, 공휴일, 영업시간 | 그냥 날짜 |

"2026-08-24 18:00:00"이라는 문자열만 봐서는 이게 셋 중 뭔지 알 수가 없다. 여기에 오프셋도 존 ID도 없으면 **정보가 빠진 값**이다. 대부분의 타임존 버그는 이 빠진 정보를 각 계층이 제멋대로 추측하면서 생긴다. 애플리케이션은 JVM 기본 타임존으로, DB는 세션 타임존으로, 브라우저는 OS 설정으로 추측하는데, 이 셋이 다르면 값이 조용히 어긋난다.

### 기본 개념 정리

#### UTC, GMT, 그리고 윤초

- **UTC(협정 세계시)**: 원자시계 기반의 국제 표준. 모든 오프셋의 기준점이다.
- **GMT**: 그리니치 평균시. 역사적 명칭이고 실무에서는 UTC와 같은 의미로 쓰이지만, 표준 문서에서는 UTC를 쓰는 게 맞다.
- **UT1**: 지구 자전 기반의 천문 시각. 지구 자전이 일정하지 않아서 UTC와 미세하게 어긋난다.

이 어긋남을 메우려고 넣던 게 **윤초(leap second)**다. UTC와 UT1의 차이가 0.9초를 넘지 않게 1초를 끼워넣는 방식인데, 분에 `:60`초가 존재하게 되면서 수많은 시스템을 터뜨렸다. 마지막 윤초는 2016년 말이었고, 2022년 국제도량형총회에서 **2035년까지 윤초 삽입을 중단**하기로 결의했다. 그 사이 대형 클라우드들은 윤초를 하루에 걸쳐 아주 조금씩 나눠 흡수하는 **leap smear** 방식을 쓴다. 우리가 실무에서 윤초를 직접 다룰 일은 거의 없지만, "1분은 항상 60초"라는 가정이 원래 틀렸다는 건 알아둘 만하다.

#### 오프셋과 타임존은 다른 것이다

이게 가장 중요한 구분이다.

```
+09:00           → 오프셋. UTC보다 9시간 빠르다는 사실 하나뿐.
Asia/Seoul       → 타임존. "이 지역이 역사적으로 어떤 오프셋을 언제 썼는지"의 규칙 전체.
```

`Asia/Seoul`은 지금은 `+09:00`이지만, 1954년부터 1961년까지는 `+08:30`이었고 1987~1988년에는 서머타임까지 있었다. 즉 **타임존은 오프셋의 시간 함수**다.

```
offset = f(zone, instant)
```

그래서 오프셋만 저장하면 "지금 이 순간"은 정확히 표현할 수 있어도, **과거나 미래의 벽시계 시각은 계산할 수 없다.** 반대로 존 ID만 있으면 tzdb 규칙을 따라 언제든 오프셋을 계산할 수 있다.

#### IANA tzdb (tz database)

`Asia/Seoul`, `Europe/Tallinn` 같은 이름의 출처다. `Area/Location` 형식이고, 각 존이 언제 어떤 오프셋과 DST 규칙을 썼는지의 역사가 전부 들어있다.

- 릴리스는 `2026a`, `2026b`, `2026c`처럼 연도 + 알파벳으로 나간다. 2026c는 2026년 7월에 나왔고, 캐나다 앨버타의 영구 표준시 전환과 모로코의 DST 폐지가 반영됐다.
- 정치적 결정으로 **1년에 몇 번씩 바뀐다.** 그래서 OS의 `tzdata` 패키지, JDK, 언어 런타임, DB의 타임존 테이블이 전부 각자의 사본을 들고 있고, 이것들이 서로 다른 버전이면 계산 결과가 달라진다.
- `Asia/Seoul` 같은 정식 이름 외에 `ROK`, `Japan` 같은 하위 호환 별칭(link)도 있다. 새로 쓸 때는 정식 이름을 쓰는 게 안전하다.

한 가지 악명 높은 함정:

```
Etc/GMT+9   →  UTC-09:00  (부호가 반대!)
Etc/GMT-9   →  UTC+09:00
```

POSIX가 부호를 반대로 정의한 유산이다. `Etc/GMT±N`은 되도록 쓰지 말고 지역 존 ID를 쓰자.

#### DST(서머타임)가 만드는 두 개의 구멍

DST가 시작되는 날에는 **존재하지 않는 시각**이, 끝나는 날에는 **두 번 오는 시각**이 생긴다.

```
[봄, DST 시작] 02:00 → 03:00 으로 점프
  02:30 은 존재하지 않는다. (gap)

[가을, DST 종료] 03:00 → 02:00 으로 되감기
  02:30 은 두 번 존재한다. (overlap)
```

`02:30`에 도는 배치가 봄에는 안 돌고 가을에는 두 번 돌 수 있다는 뜻이다. 시간당 집계 테이블에 유니크 제약이 걸려 있으면 가을에 중복 키로 터진다. 그래서 스케줄러는 되도록 UTC 기준으로 돌리고, 로컬 시각이 꼭 필요하면 DST 전환 시간대(보통 새벽 1~4시)를 피해서 잡는 게 정석이다.

참고로 **EU의 서머타임 폐지**는 2018년 집행위 제안, 2019년 유럽의회 찬성 표결까지 갔지만 이사회에서 합의가 안 되어 지금도 계류 중이다. 즉 유럽 서비스를 붙들고 있다면 서머타임은 당분간 계속 고려해야 한다.

#### 표기 포맷: ISO 8601, RFC 3339, RFC 9557

```
2026-08-24T18:00:00+09:00            RFC 3339 (오프셋 포함, 인터넷 표준)
2026-08-24T09:00:00Z                 같은 시점, UTC 표기 (Z = Zulu = +00:00)
2026-08-24T18:00:00                  오프셋 없음 → 해석하는 쪽 마음대로 (위험)
2026-08-24T18:00:00+03:00[Europe/Tallinn]   RFC 9557 (IXDTF), 존 ID까지 표기
1787987200                           Unix epoch (UTC 기준 초)
```

- **ISO 8601**은 넓은 규격이고, **RFC 3339**는 그중 인터넷에서 쓰기 좋게 좁혀놓은 프로파일이다. API 스펙에는 RFC 3339라고 명시하는 게 정확하다.
- **RFC 9557(IXDTF)**은 2024년에 나온 확장으로, 오프셋 뒤에 대괄호로 **존 ID를 함께 실을 수 있다.** 오프셋만으로는 잃어버리는 "어느 지역 기준인지"를 보존할 수 있어서, 예약·일정처럼 미래 시각을 다루는 API에 잘 맞는다. JS의 Temporal도 이 포맷을 쓴다.
- **epoch**는 항상 UTC 기준이라 타임존 논쟁이 없지만, 사람이 못 읽고 밀리초/초/마이크로초 단위 혼동이 잦다.

### 설계 원칙 다섯 줄

구현 얘기로 넘어가기 전에, 결론부터 박아두면 이렇다.

1. **시점은 UTC로 저장한다.** 로그, 감사 기록, 생성/수정 시각 전부.
2. **미래의 약속은 로컬 시각 + 존 ID로 저장한다.** 오프셋으로 굳히면 안 된다. 그 나라가 내년에 서머타임을 폐지하면 약속 시각이 한 시간 밀린다.
3. **변환은 표시할 때만 한다.** 저장·전송·계산은 UTC로, 사용자 눈앞에서만 로컬로 바꾼다.
4. **타임존은 명시적으로 넘긴다.** "시스템 기본값"에 의존하는 순간 배포 환경이 바뀔 때마다 값이 달라진다.
5. **경계마다 어떤 종류의 값인지 문서화한다.** API 스펙에 "UTC, RFC 3339"라고 한 줄 적어두는 게 버그 열 개를 막는다.

### 데이터베이스

#### MySQL / MariaDB: DATETIME과 TIMESTAMP

| | DATETIME | TIMESTAMP |
|---|---|---|
| 저장 | 입력값 그대로 (벽시계) | **UTC로 변환해서 저장** |
| 조회 | 저장값 그대로 | 세션 타임존으로 변환해서 반환 |
| 세션 타임존 영향 | 없음 | **있음** |
| 범위 | 1000-01-01 ~ 9999-12-31 | 1970-01-01 01Z ~ **2038-01-19 03:14:07Z** |
| 크기 | 5바이트 + 소수부 | 4바이트 + 소수부 |
| 의미 | 벽시계 시각 | 시점(instant) |

정리하면 **시점을 저장하려면 TIMESTAMP, 벽시계 시각을 저장하려면 DATETIME**이다. 다만 TIMESTAMP는 2038년 한계(32비트 epoch)가 있어서, 많은 팀이 "DATETIME 컬럼에 UTC 값만 넣는다"는 규칙으로 우회한다. 이 방식을 쓸 거면 **애플리케이션이 반드시 UTC로 변환해서 넣는다**는 규칙을 팀 전체가 지켜야 한다. 컬럼명을 `created_at_utc`처럼 짓는 것도 방법이다.

#### 세션/글로벌 타임존과 타임존 테이블

MySQL·MariaDB는 기본적으로 `time_zone = SYSTEM`, 즉 OS 시간대를 따른다.

```sql
SELECT @@global.time_zone, @@session.time_zone, NOW(), UTC_TIMESTAMP();
```

여기서 `Asia/Seoul` 같은 **이름**을 쓰려면 타임존 테이블(`mysql.time_zone*`)이 적재돼 있어야 한다. 안 그러면 `+09:00` 같은 오프셋 표기만 먹는다.

```bash
# MySQL
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root -p mysql

# MariaDB 10.5+ (배포판에 따라 바이너리 이름이 다르다)
mariadb-tzinfo-to-sql /usr/share/zoneinfo | mariadb -u root -p mysql
```

적재 중 `Skipping leap second` 경고가 몇 줄 나오는 건 정상이다. 그다음 적용한다.

```sql
SET GLOBAL time_zone = 'Asia/Seoul';   -- 즉시 반영 (기존 커넥션은 세션값 유지)
```

재부팅 후에도 유지하려면 설정 파일에 박아야 한다.

```ini
# my.cnf / 50-server.cnf 의 [mysqld] 섹션
default-time-zone = 'Asia/Seoul'
```

**오프셋 고정(`+09:00`)과 존 이름(`Asia/Seoul`)의 차이**가 여기서 갈린다. 한국처럼 DST가 없는 지역은 사실상 차이가 없지만, DST가 있는 지역에 오프셋을 고정해두면 서머타임 전환 때 한 시간씩 어긋난다. 존 이름을 쓰면 tzdb 규칙에 따라 자동으로 전환된다. 대신 존 이름을 쓰려면 위의 타임존 테이블 적재가 선행돼야 하고, **tzdata가 갱신되면 테이블도 다시 적재**해야 한다.

변환 함수도 같은 제약을 받는다.

```sql
SELECT CONVERT_TZ('2026-08-24 18:00:00', 'Asia/Seoul', 'Europe/Tallinn');
-- 테이블 미적재 시 NULL 반환 (에러가 아니라 조용히 NULL이라 더 위험하다)
```

#### PostgreSQL: timestamptz가 정답에 가깝다

| | `timestamp` (without time zone) | `timestamptz` (with time zone) |
|---|---|---|
| 저장 | 입력값 그대로 | **UTC로 정규화해서 저장** |
| 존 정보 | 없음 | 저장 안 함 (UTC로 변환만 하고 버림) |
| 조회 | 그대로 | 세션 `TimeZone` 설정으로 변환 |
| 의미 | 벽시계 시각 | 시점(instant) |

이름이 오해를 부르는데, `timestamptz`는 **타임존을 저장하지 않는다.** 입력을 UTC로 바꿔서 넣고 출력할 때 세션 타임존으로 되돌릴 뿐이다. 그래서 "어느 지역 기준으로 잡힌 약속인지"가 중요하면 존 ID를 **별도 컬럼**에 함께 저장해야 한다.

```sql
SHOW TimeZone;
SET TIME ZONE 'Asia/Seoul';
SELECT * FROM pg_timezone_names WHERE name LIKE 'Europe/%';
```

`AT TIME ZONE`은 방향에 따라 결과 타입이 바뀌는 게 포인트다.

```sql
-- 벽시계 → 시점 : "이 벽시계 시각을 서울 기준으로 해석해줘"
SELECT '2026-08-24 18:00:00'::timestamp AT TIME ZONE 'Asia/Seoul';   -- → timestamptz

-- 시점 → 벽시계 : "이 시점을 탈린 벽시계로 보여줘"
SELECT now() AT TIME ZONE 'Europe/Tallinn';                          -- → timestamp
```

#### 마이그레이션할 때 조심할 것

컬럼 타입을 바꾸면 **기존 값이 재해석된다.** `timestamp`를 `timestamptz`로 바꾸면 기존 값이 "세션 타임존의 벽시계 시각"으로 간주되어 UTC로 변환된다. 서버가 UTC이고 값은 KST로 들어가 있었다면, 그 순간 전체 데이터가 9시간 어긋난다. 타입 변경 전에 반드시 어떤 기준으로 들어간 값인지 확인하고 `AT TIME ZONE`으로 명시적으로 변환하자.

### 애플리케이션

#### Java: java.time 타입 고르기

`java.util.Date`와 `Calendar`는 이제 쓰지 않는다. `java.time`(JSR-310)에서 목적별로 타입을 고르면 된다.

| 타입 | 담고 있는 것 | 언제 쓰나 |
|------|------------|----------|
| `Instant` | UTC 기준 시점 | 로그, 생성 시각, 시스템 간 전달 |
| `OffsetDateTime` | 시점 + 오프셋 | API 입출력, DB 시점 컬럼 매핑 |
| `ZonedDateTime` | 시점 + 존 규칙 | 사용자에게 보여줄 때, 미래 일정 계산 |
| `LocalDateTime` | 벽시계 시각 | 존이 확정되지 않은 입력값 |
| `LocalDate` / `LocalTime` | 날짜만 / 시간만 | 생일, 영업시간 |
| `Duration` / `Period` | 시간 간격 / 날짜 간격 | 경과 시간, 개월 계산 |

`LocalDateTime`은 **시점이 아니다.** 이걸 시점처럼 쓰기 시작하면 반드시 사고가 난다.

DST 경계에서 `java.time`이 어떻게 동작하는지도 알아두면 좋다.

```java
// gap: 존재하지 않는 시각은 gap 길이만큼 뒤로 밀린다
ZonedDateTime.of(gapLocalTime, zone);          // 02:30 → 03:30

// overlap: 기본은 앞쪽(이른) 오프셋
zdt.withEarlierOffsetAtOverlap();
zdt.withLaterOffsetAtOverlap();

// 존 변환: 시점을 유지할지, 벽시계를 유지할지 반드시 구분
zdt.withZoneSameInstant(ZoneId.of("Europe/Tallinn"));  // 같은 순간, 다른 벽시계
zdt.withZoneSameLocal(ZoneId.of("Europe/Tallinn"));    // 같은 벽시계, 다른 순간
```

JVM 기본 타임존은 되도록 UTC로 고정하고, 표시에 필요한 존은 명시적으로 넘기는 걸 권한다.

```bash
java -Duser.timezone=UTC -jar app.jar
```

`TimeZone.setDefault()`를 런타임에 호출하는 건 전역 상태를 바꾸는 행위라 피하는 게 좋다.

#### JDBC(MySQL Connector/J) 옵션

여기가 "DB엔 제대로 들어갔는데 애플리케이션에서 9시간 밀려 보이는" 사고가 가장 많이 나는 지점이다. Connector/J 8.0.23부터 옵션 체계가 정리됐다.

| 옵션 | 의미 |
|------|------|
| `connectionTimeZone` | 세션 타임존을 무엇으로 볼지: `LOCAL`(JVM), `SERVER`(서버 조회), 또는 특정 존 ID |
| `forceConnectionTimeZoneToSession` | 서버 세션의 `time_zone`을 위 값으로 강제할지 |
| `preserveInstants` | 변환을 수행해 **시점**을 보존할지, 아니면 표시값만 유지할지 |

가장 무난한 조합은 시점 보존을 켜고 서버 세션을 따르는 것이다.

```
jdbc:mysql://host:3306/db?connectionTimeZone=SERVER&preserveInstants=true
```

서버 타임존이 `CST` 같은 모호한 약어라 인식이 안 되면, 존을 명시적으로 지정하고 세션까지 강제하는 조합을 쓴다.

```
?connectionTimeZone=UTC&forceConnectionTimeZoneToSession=true&preserveInstants=true
```

단 세션 타임존을 강제하면 서버의 `NOW()`, `CURDATE()` 결과도 함께 바뀐다는 점을 기억하자. Hibernate를 쓴다면 다음 설정으로 JDBC 계층 타임존을 UTC로 못박을 수 있다.

```properties
spring.jpa.properties.hibernate.jdbc.time_zone=UTC
```

그리고 타입 짝을 맞춰야 한다. **시점 컬럼(TIMESTAMP)에는 `Instant`/`OffsetDateTime`, 벽시계 컬럼(DATETIME)에는 `LocalDateTime`.** 이걸 섞으면 드라이버가 어느 쪽으로도 변환할 수 있어서 환경마다 다른 값이 나온다.

#### JavaScript: Date의 함정과 Temporal

`Date`의 파싱 규칙이 대표적인 지뢰다.

```js
new Date('2026-08-24')            // 날짜만 → UTC 자정으로 해석
new Date('2026-08-24T00:00:00')   // 시각 포함, 오프셋 없음 → 로컬로 해석
// 두 값은 KST 환경에서 9시간 차이가 난다
```

`Date`는 내부적으로 UTC epoch 밀리초 하나만 들고 있고, 타임존은 실행 환경의 로컬 존만 쓸 수 있다. 그래서 "서울 기준 오전 9시"를 다루려면 라이브러리가 필요했다.

**Temporal API**가 이 문제를 표준 차원에서 해결한다. TC39 Stage 3이고, Firefox 139(2025년), Chrome 144(2026년)에서 기본 지원이 들어갔다. Safari는 기술 프리뷰 단계다.

```js
Temporal.Now.instant()                                  // 시점
Temporal.Now.zonedDateTimeISO('Asia/Seoul')             // 시점 + 존
Temporal.PlainDate.from('2026-08-24')                   // 날짜만
Temporal.ZonedDateTime.from('2026-08-24T18:00+09:00[Asia/Seoul]')
```

타입이 `Instant` / `ZonedDateTime` / `PlainDate` / `PlainDateTime` / `Duration`으로 나뉘는 게 `java.time`과 판박이다. 결국 **시점과 벽시계를 타입으로 구분한다**는 같은 결론에 도달한 셈이다. 아직 전 브라우저 지원은 아니니 당분간은 폴리필과 병행하게 된다.

사용자의 존을 알아내는 건 이 한 줄이면 된다.

```js
Intl.DateTimeFormat().resolvedOptions().timeZone  // "Asia/Seoul"
```

### 인프라와 OS

#### 서버 타임존

```bash
timedatectl                              # 현재 상태 확인
timedatectl set-timezone Asia/Seoul      # 변경 (/etc/localtime 심볼릭 링크가 바뀐다)
date -u                                  # UTC로 확인
ls -l /etc/localtime                     # 어느 존을 가리키는지
```

하드웨어 클록(RTC)은 **UTC로 두는 게 원칙**이다. 로컬 시각으로 두면 듀얼 부팅이나 DST 전환에서 꼬인다.

서버 자체는 UTC로 두고 표시만 로컬로 하는 구성을 기본으로 삼는 걸 권한다. 로그가 UTC면 여러 리전 서버의 로그를 시간순으로 합칠 때 고민이 사라진다.

#### 컨테이너

컨테이너는 기본이 UTC다. 호스트의 타임존을 물려받지 않는다.

```dockerfile
# alpine은 tzdata 패키지가 없으면 TZ가 먹지 않는다
RUN apk add --no-cache tzdata
ENV TZ=Asia/Seoul
```

```bash
docker run -e TZ=Asia/Seoul ...
```

여기서 진짜 문제는 **계층마다 타임존이 다를 수 있다는 것**이다.

```
호스트 OS  →  컨테이너  →  JVM  →  JDBC 세션  →  DB 서버  →  DB 세션
```

이 여섯 군데가 전부 각자의 기본값을 가진다. 하나라도 다르면 값이 어긋나고, 더 나쁜 건 **에러가 아니라 그냥 다른 값**이 나온다는 점이다. 그래서 "전부 UTC로 통일하고 표시할 때만 변환"이 사고를 가장 적게 내는 구성이다.

#### tzdata 갱신

tzdb는 정치적 결정에 따라 1년에 몇 번씩 바뀐다. 오래된 이미지를 그대로 쓰면 옛 규칙으로 계산한다.

```bash
apt-get update && apt-get install --only-upgrade tzdata   # OS
```

JDK는 자체 tzdb 사본을 들고 있어서 **JDK 패치 버전을 올리면 함께 갱신**된다. MySQL의 타임존 테이블은 자동으로 갱신되지 않으므로 tzdata를 올린 뒤 다시 적재해야 한다. 정리하면 tzdata 갱신 대상은 **OS, 런타임(JDK 등), DB 타임존 테이블** 세 곳이다.

#### 배치와 cron

로컬 타임존 기준으로 도는 cron은 DST 전환일에 작업을 건너뛰거나 두 번 실행한다. 대응은 셋 중 하나다.

1. 시스템/스케줄러를 UTC로 돌린다 (가장 안전)
2. 전환 시간대(새벽 1~4시)를 피해서 스케줄을 잡는다
3. 작업 자체를 멱등하게 만들어 두 번 돌아도 문제없게 한다

### 증상으로 원인 찾기

| 증상 | 유력한 원인 |
|------|-----------|
| 값이 정확히 9시간(또는 N시간) 차이 | 한쪽은 UTC, 한쪽은 KST 해석. 대개 JDBC 세션 ↔ DB 세션 |
| DB에서 조회하면 맞는데 API 응답만 다름 | 직렬화 단계에서 JVM 기본 존으로 포맷 중 |
| 특정 날짜 전후로만 한 시간 어긋남 | DST 전환. 오프셋 고정으로 저장한 값 |
| 저장할 땐 맞는데 재기동 후 달라짐 | 설정 파일 없이 `SET GLOBAL`만 함, 또는 컨테이너 재생성으로 TZ 유실 |
| 날짜가 하루 밀림 | 자정 근처 값 + 존 변환. `Date`의 날짜-only 파싱도 흔한 원인 |
| `CONVERT_TZ`가 NULL 반환 | 타임존 테이블 미적재 |
| 예약 시각이 몇 달 뒤부터 한 시간 밀림 | 미래 시각을 오프셋으로 굳혀서 저장 |
| 2038년 이후 값 저장 실패 | MySQL TIMESTAMP 범위 초과 |

### 체크리스트

설계할 때:

- [ ] 이 값은 시점인가, 벽시계 시각인가, 날짜인가
- [ ] 시점이면 UTC로 저장하는가
- [ ] 미래의 약속이면 존 ID를 함께 저장하는가
- [ ] 컬럼 타입이 의미와 맞는가 (TIMESTAMP=시점, DATETIME=벽시계)
- [ ] API 스펙에 포맷과 기준 타임존이 명시돼 있는가

운영할 때:

- [ ] OS / 컨테이너 / 런타임 / DB의 타임존이 의도대로 통일돼 있는가
- [ ] DB 타임존 테이블이 적재돼 있고 tzdata와 함께 갱신되는가
- [ ] 설정이 재부팅·재배포 후에도 유지되는가 (설정 파일에 박혀 있는가)
- [ ] 로그가 UTC로 남는가
- [ ] 배치가 DST 전환일에 안전한가

테스트할 때:

- [ ] DST 시작·종료 경계의 값으로 테스트하는가
- [ ] 서로 다른 JVM 기본 타임존에서 테스트가 통과하는가
- [ ] 자정 직전·직후 값으로 날짜 경계를 확인했는가

### 마무리

타임존 문제의 90%는 **값의 종류를 구분하지 않은 것**과 **기본값에 의존한 것** 둘로 수렴한다. 시점은 UTC로 저장하고, 약속은 존 ID와 함께 저장하고, 변환은 화면 앞에서만 한다. 그리고 어느 계층에서도 "알아서 해주겠지"를 기대하지 않는다. 이 원칙만 지키면 나머지는 도구 설정 문제고, 그건 위 표를 다시 보면 된다.

### 참고

- [IANA Time Zone Database](https://www.iana.org/time-zones)
- [RFC 3339 - Date and Time on the Internet: Timestamps](https://www.rfc-editor.org/info/rfc3339/)
- [RFC 9557 - Timestamps with Additional Information (IXDTF)](https://www.rfc-editor.org/info/rfc9557/)
- [MySQL Connector/J - Preserving Time Instants](https://dev.mysql.com/doc/connector-j/en/connector-j-time-instants.html)
- [PostgreSQL - Date/Time Types](https://www.postgresql.org/docs/current/datatype-datetime.html)
- [MDN - Temporal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)
- [EU 계절별 시간 변경 논의 현황 - Council of the EU](https://www.consilium.europa.eu/en/policies/seasonal-time-changes/)
