# RHR/HRV 미수집 시 회복 판단 Fallback 정책

## 1. 배경

루핀에서 회복 상태를 판단하기 위해 안정시 심박(RHR)과 심박변이도(HRV)를 사용하려고 한다.

하지만 실제 운영에서는 RHR/HRV가 매일 안정적으로 들어온다고 가정하면 안 된다.

데이터가 없는 대표적인 경우는 다음과 같다.

- 워치를 착용하지 않은 날
- 밤에 워치를 차지 않아 수면 중 HRV가 없는 날
- 측정은 됐지만 폰 또는 서버로 늦게 동기화되는 경우
- Android Health Connect 경로에서 RHR/HRV가 제공되지 않는 경우
- 기기 또는 앱 설정상 심박 자동 측정이 꺼진 경우

따라서 RHR/HRV가 없을 때 임의로 값을 채우지 않고, 명확한 우선순위에 따라 대체 신호를 사용한다.

## 2. 기본 원칙

### 2.1 실측 우선

RHR/HRV는 실제 측정값이 있으면 가장 신뢰도가 높다.

판단 순서는 다음과 같다.

```txt
실측값 재조회
-> 러닝 기반 파생 신호
-> 신규 유저 prior baseline
-> 데이터 없음 처리
```

### 2.2 빈 값을 임의로 채우지 않는다

다음 방식은 사용하지 않는다.

- 전날 값 복사
- 나이/성별 평균으로 빈 날 채우기
- 임의 보간
- HRV가 없는데 있는 것처럼 추정
- RHR과 dRHR, HRV SDNN과 RMSSD를 섞어서 기준선 계산

없는 값은 없는 값으로 둔다.

### 2.3 대체 신호는 기준선에 섞지 않는다

러닝 기반 파생 신호나 prior baseline은 회복 판단의 보조 신호로만 사용한다.

RHR/HRV의 개인 기준선에는 오직 실측값만 넣는다.

## 3. Fallback 우선순위

이번 버전에서는 아래 세 단계만 적용한다.

```txt
0순위: 최근 72시간 재조회
1순위: 러닝 기록 기반 대체 신호
3순위: 신규 유저용 나이/성별 prior baseline
```

아침 설문 기반 check-in은 이번 버전에서 제외한다.

## 4. 0순위: 최근 72시간 재조회

RHR/HRV가 없는 경우, 바로 "없음"으로 확정하지 않는다.

헬스 데이터는 측정 시점과 서버 도착 시점이 다를 수 있다. 특히 iOS는 폰 잠금 해제 이후 HealthKit 데이터가 앱으로 들어오는 경우가 있다.

따라서 동기화 시마다 최근 72시간 데이터를 다시 읽는다.

### 정책

```txt
최근 72시간 안의 날짜
- 값이 없으면 pending
- 다음 동기화 때 다시 조회

72시간이 지난 날짜
- 값이 없으면 missing 확정
```

### 저장 정책

실측값이 들어온 경우:

```txt
tier = 0
source = healthkit 또는 health_connect
status = final
```

72시간 내 아직 없는 경우:

```txt
value = null
status = pending
```

72시간 이후에도 없는 경우:

```txt
value = null
status = missing
missing_reason = not_worn | no_wearable | sync_missing | permission_missing 등
```

늦게라도 실측값이 들어오면 기존 pending 또는 missing 상태를 실측값으로 덮어쓴다.

## 5. 1순위: 러닝 기록 기반 대체 신호

RHR/HRV가 없더라도 최근 러닝 기록이 있다면 운동 데이터에서 회복 상태를 추정한다.

이 신호들은 RHR/HRV 자체를 대체하는 값이 아니다. 대신 "회복 판단에 참고할 수 있는 러닝 기반 파생 신호"로 사용한다.

### 5.1 Pace-HR Trend

같은 페이스로 달렸는데 심박이 평소보다 높으면 피로 가능성이 있다.

예시:

```txt
평소 6'00"/km 페이스에서 평균 심박 145bpm
오늘 6'00"/km 페이스에서 평균 심박 154bpm

-> 같은 강도 대비 심박 상승
-> 피로, 더위, 수면 부족, 컨디션 저하 가능성
```

### 5.2 HRR

운동 후 심박 회복 속도를 본다.

운동 종료 후 1~2분 사이 심박이 빠르게 떨어지면 회복 상태가 좋은 편으로 본다. 반대로 평소보다 덜 떨어지면 피로 신호로 본다.

Apple Watch는 `heartRateRecoveryOneMinute`를 직접 제공할 수 있다.

Android Health Connect에는 HRR 전용 타입이 없으므로 심박 샘플로 직접 계산한다.

### 5.3 운동 부하

최근 운동량이 평소보다 급격히 증가했는지 본다.

예시 지표:

- 최근 7일 / 최근 28일 운동량 비율
- ACWR
- 주간 러닝 거리
- 주간 운동 시간
- 고강도 세션 수

운동 부하는 HRV 대체 신호라기보다는 "몸에 쌓인 부담"을 보는 축이다.

## 6. 러닝 기반 신호 사용 조건

러닝 기반 신호는 최근 7일 이내 유효 러닝이 있을 때만 사용한다.

### 유효 러닝 조건

```txt
운동 타입 = running 또는 treadmill running
운동 시간 >= 10분
심박 샘플 존재
거리 또는 페이스 데이터 존재
비정상 심박 제거
```

HRR은 추가 조건을 둔다.

```txt
운동 종료 전 심박 >= 0.70 * HRmax
```

저강도 운동은 HRR이 원래 작게 나올 수 있으므로 제외한다.

HRmax가 없으면 다음 식을 임시로 사용한다.

```txt
HRmax = 208 - 0.7 * age
```

## 7. 3순위: 신규 유저 prior baseline

가입 직후에는 개인 기준선이 없다.

이때만 나이/성별 평균 또는 일반적인 인구 통계 기반 prior를 임시 기준선으로 사용한다.

### 사용 조건

```txt
가입 초기
또는
실측 RHR/HRV 기준선이 아직 부족한 경우
```

### 제한

prior baseline은 최대 2주까지만 사용한다.

실측값이 쌓일수록 prior의 영향은 줄인다.

```txt
0~3일: prior 비중 높음
4~7일: prior + 실측 혼합
8~14일: 실측 중심
14일 이후: prior 제거
```

### 금지 사항

나이/성별 평균으로 빈 날을 채우지 않는다.

```txt
금지:
- 9월 1일 HRV 없음 -> 또래 평균 45ms 저장
- 9월 2일 RHR 없음 -> 또래 평균 62bpm 저장
```

prior는 "초기 기준선"일 뿐, 일별 측정값 대체가 아니다.

## 8. 데이터 저장 정책

### daily_metrics

RHR/HRV 실측 또는 missing 상태를 저장한다.

```sql
CREATE TABLE daily_metrics (
  user_id          BIGINT NOT NULL,
  date             DATE   NOT NULL,
  metric           TEXT   NOT NULL, -- 'rhr' | 'hrv'
  value            NUMERIC,
  unit             TEXT   NOT NULL, -- 'bpm' | 'ms'
  method           TEXT,            -- 'sdnn' | 'rmssd' | 'source_rhr' | 'derived_rhr'
  tier             SMALLINT NOT NULL,
  source           TEXT   NOT NULL, -- 'healthkit' | 'health_connect' | 'prior'
  measured_during  TEXT,            -- 'sleep' | 'daytime'
  external_id      TEXT,
  status           TEXT NOT NULL DEFAULT 'final', -- 'pending' | 'final' | 'missing'
  missing_reason   TEXT,
  updated_at       TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (user_id, date, metric)
);
```

### running_recovery_signals

러닝 기반 파생 신호는 별도 테이블에 저장한다.

```sql
CREATE TABLE running_recovery_signals (
  user_id       BIGINT NOT NULL,
  workout_id    BIGINT NOT NULL,
  date          DATE   NOT NULL,
  signal        TEXT   NOT NULL, -- 'pace_hr_trend' | 'hrr' | 'load'
  value         NUMERIC,
  z_score       NUMERIC,
  unit          TEXT,
  tier          SMALLINT NOT NULL DEFAULT 1,
  source        TEXT NOT NULL DEFAULT 'running_derived',
  status        TEXT NOT NULL DEFAULT 'final',
  created_at    TIMESTAMPTZ NOT NULL,
  updated_at    TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (user_id, workout_id, signal)
);
```

## 9. 회복 판단 입력 구조

코칭 AI에는 실측 여부와 fallback tier를 그대로 넘긴다.

```json
{
  "date": "2026-09-03",
  "readiness": {
    "rhr": {
      "z": null,
      "tier": 4,
      "status": "missing",
      "missing_reason": "not_worn"
    },
    "hrv": {
      "z": null,
      "tier": 4,
      "status": "missing",
      "missing_reason": "not_worn"
    },
    "running_derived": {
      "tier": 1,
      "pace_hr_trend": {
        "z": 0.9,
        "direction": "higher_hr_than_usual"
      },
      "hrr": {
        "z": -0.7,
        "session_age_h": 14
      },
      "load": {
        "acwr": 1.32
      }
    },
    "prior": {
      "tier": 3,
      "used": false
    }
  }
}
```

프롬프트에는 다음 우선순위를 명시한다.

```txt
실측 RHR/HRV를 가장 신뢰한다.
실측이 없으면 러닝 기반 파생 신호를 보조 판단으로 사용한다.
신규 유저는 prior baseline을 임시 기준선으로만 사용한다.
없는 데이터를 있는 것처럼 말하지 않는다.
```

## 10. 판단 정책

### 실측 RHR/HRV가 있는 경우

실측 기반 회복 판단을 우선한다.

```txt
tier 0 우선
```

### 실측이 없고 러닝 신호가 있는 경우

러닝 기반 신호로 보수적으로 판단한다.

```txt
pace_hr_trend 나쁨
+ HRR 나쁨
+ 최근 운동 부하 높음

-> 회복 저하 가능성
```

단, 러닝 신호만으로 강한 단정은 하지 않는다.

표현 예시:

```txt
오늘은 평소보다 같은 페이스에서 심박이 높게 나타났어요.
최근 운동 부하도 높은 편이라 강도를 조금 낮추는 편이 좋아 보여요.
```

금지 표현:

```txt
오늘은 회복이 확실히 안 됐어요.
오늘은 반드시 쉬어야 해요.
```

### 실측도 없고 러닝 신호도 없는 경우

신규 유저라면 prior baseline을 사용한다.

그 외에는 회복 판단을 보류한다.

```txt
회복 데이터를 충분히 판단하기 어려워요.
러닝 기록이나 워치 착용 데이터가 쌓이면 더 정확해집니다.
```

## 11. Android 정책

Android에서는 Apple처럼 RHR/HRV가 안정적으로 들어온다고 가정하지 않는다.

Health Connect에 데이터 타입이 있어도 Samsung Health 또는 Garmin Connect가 실제로 써주지 않으면 읽을 수 없다.

따라서 Android는 기본적으로 다음 정책을 따른다.

```txt
RHR/HRV 직접 수집 기대 낮음
-> HeartRateRecord가 있으면 파생 계산
-> 러닝 기록이 있으면 1순위 fallback 사용
-> 없으면 missing
```

Android에서 HRV는 기본 회복 축으로 기대하지 않는다.

문서와 화면에서는 다음처럼 표현한다.

```txt
Android는 Health Connect에 들어오는 심박 및 운동 기록을 기반으로 회복을 추정합니다.
```

## 12. 사용자 화면 표현

데이터 출처를 숨기지 않는다.

### 실측 기반

```txt
수면 중 측정된 심박변이도와 안정시 심박을 기준으로 봤어요.
```

### 러닝 기반

```txt
최근 러닝 기록에서 평소 대비 심박 반응을 기준으로 봤어요.
```

### prior 기반

```txt
아직 개인 기준선이 부족해서 초기 기준으로만 참고했어요.
```

### 데이터 없음

```txt
오늘은 회복을 판단할 데이터가 부족해요.
```

## 13. 이번 버전에서 제외하는 것

이번 버전에서는 아래 항목을 적용하지 않는다.

- 아침 설문 check-in
- 감정/피로도 직접 입력
- 전날 값 복사
- 평균값으로 빈 날 채우기
- Android HRV 직접 수집 전제
- 단일 신호 기반 강한 caution 판단

## 14. 구현 순서

1. RHR/HRV 수집 파이프라인 구성
2. 최근 72시간 재조회 로직 구현
3. `pending -> final/missing` 상태 전환 배치 구현
4. `daily_metrics` 저장 정책 적용
5. 러닝 기반 `pace_hr_trend` 계산
6. 러닝 기반 HRR 계산
7. 최근 운동 부하 계산
8. 신규 유저 prior baseline 적용
9. 코칭 AI 입력 컨텍스트에 tier/source/status 포함
10. 사용자 화면에 데이터 출처 라벨 표시

## 15. 최종 정책 요약

루핀은 RHR/HRV가 없는 날을 억지로 채우지 않는다.

먼저 최근 72시간 데이터를 다시 읽어 늦게 들어온 실측값을 회수한다. 그래도 없으면 최근 러닝 기록에서 pace-HR trend, HRR, 운동 부하를 계산해 보조 회복 신호로 사용한다. 신규 유저는 개인 기준선이 생기기 전까지만 나이/성별 기반 prior baseline을 임시로 사용한다.

설문 입력은 이번 버전에서 제외한다.

핵심 원칙은 다음과 같다.

```txt
있는 데이터는 정직하게 쓰고,
없는 데이터는 없는 상태로 남기며,
대체 신호는 대체 신호라고 표시한다.
```
