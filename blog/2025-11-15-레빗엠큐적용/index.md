---
slug: rabbitmq
title: RabbitMQ 구성하면서 어려웠던거
authors:
  - haeyoung
tags:
  - RabbitMQ
  - spring
  - Infra
---
사내 프로젝트에서 서비스간 비동기 메시지 통신이 필요한 상황이 생겨서 `RabbitMQ`를 도입하게 되었다. 적용하면서 개념적으로 헷갈렸던 부분들과 실제로 마주한 문제들을 정리해보자.

### RabbitMQ 기본 구조

먼저 `RabbitMQ`의 핵심 구성요소를 짚고 넘어가자.

```bash
Producer → Exchange → Binding → Queue → Consumer
```

1. **Producer**: 메시지를 발행하는 주체
2. **Exchange**: 메시지를 받아서 적절한 `Queue`로 라우팅하는 역할
3. **Binding**: `Exchange`와 `Queue`를 연결하는 규칙
4. **Queue**: 메시지가 실제로 쌓이는 곳
5. **Consumer**: `Queue`에서 메시지를 꺼내 처리하는 주체

여기서 중요한건 `Exchange`의 타입이다.

| Exchange Type | 동작 |
|---|---|
| Direct | `routingKey`가 정확히 일치하는 `Queue`로 전달 |
| Topic | `routingKey` 패턴 매칭 (`*`, `#` 와일드카드) |
| Fanout | 바인딩된 모든 `Queue`에 브로드캐스트 |
| Headers | 헤더 값 기반 매칭 |

나는 `Topic Exchange`를 사용했다. 서비스별로 `routingKey` 패턴을 다르게 설정해서 유연하게 라우팅하고 싶었기 때문이다.

### Queue는 누가 만들어야 하는가?

처음에 제일 헷갈렸던 부분이다. A가 `Publish`(발행)하고 B가 `Consume`(구독)한다면, Queue를 만드는 주체는 누구일까?

결론부터 말하면 **Consumer가 만드는게 맞다**.

> RabbitMQ 기본 철학: "발행자는 Queue 이름을 몰라야 한다." Queue는 Consumer가 선언해야 한다. Producer는 Exchange + Routing Key만 알면 충분하다.

소비 시나리오를 정리하면 다음과 같다.

1. B 서버가 실행됨
2. "나는 `APT001/B1` 데이터를 소비한다" → Queue + Binding 생성
3. A 서버는 `routingKey`만 보고 발행
4. RabbitMQ가 만들어진 Queue로 메시지 라우팅
5. B 서버가 안정적으로 소비

하지만 이 구조에서 문제가 발생했다. B 서버가 아직 실행되지 않은 상태에서 A가 메시지를 발행하면, Queue가 존재하지 않으므로 메시지가 유실된다. 이 부분은 뒤에서 다시 다루겠다.

### Spring Boot 설정

#### 의존성

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-amqp")
}
```

#### application.yml

```yaml
spring:
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest
```

#### RabbitMQ Config

```kotlin
@Configuration
class RabbitMQConfig {

    @Bean
    fun topicExchange(): TopicExchange {
        return TopicExchange("parking.exchange")
    }

    @Bean
    fun queue(): Queue {
        return Queue("parking.event.queue", true) // durable = true
    }

    @Bean
    fun binding(queue: Queue, exchange: TopicExchange): Binding {
        return BindingBuilder
            .bind(queue)
            .to(exchange)
            .with("parking.event.#") // Topic 패턴
    }

    @Bean
    fun messageConverter(): MessageConverter {
        return Jackson2JsonMessageConverter()
    }

    @Bean
    fun rabbitTemplate(
        connectionFactory: ConnectionFactory,
        messageConverter: MessageConverter,
    ): RabbitTemplate {
        val template = RabbitTemplate(connectionFactory)
        template.messageConverter = messageConverter
        return template
    }
}
```

`Jackson2JsonMessageConverter`를 설정해두면 객체를 자동으로 `JSON`으로 변환해서 메시지를 보내준다. 이거 안 하면 기본 `SimpleMessageConverter`가 사용되는데, 바이트 배열로 전송되어서 디버깅이 힘들어진다.

#### Producer

```kotlin
@Service
class ParkingEventPublisher(
    private val rabbitTemplate: RabbitTemplate,
) {

    fun publishEvent(event: ParkingEvent) {
        rabbitTemplate.convertAndSend(
            "parking.exchange",
            "parking.event.inout",
            event
        )
    }
}
```

#### Consumer

```kotlin
@Service
class ParkingEventConsumer {

    @RabbitListener(queues = ["parking.event.queue"])
    fun handleEvent(event: ParkingEvent) {
        // 메시지 처리 로직
        println("Received: ${event.ticketNo}")
    }
}
```

### 마주한 문제들

#### 1. 메시지 유실

위에서 언급한대로 Consumer가 아직 실행되지 않은 상태에서 메시지가 발행되면 유실된다. 이를 방지하려면 `Queue`를 `durable`로 설정하고, Exchange와 Binding도 미리 선언되어 있어야한다.

```kotlin
Queue("parking.event.queue", true) // durable = true
```

하지만 이것만으로는 부족하다. `Producer`에서 메시지를 보낼때 `deliveryMode`를 `PERSISTENT`로 설정해야 RabbitMQ가 디스크에 저장한다.

```kotlin
rabbitTemplate.convertAndSend("parking.exchange", "parking.event.inout", event) { message ->
    message.messageProperties.deliveryMode = MessageDeliveryMode.PERSISTENT
    message
}
```

#### 2. Consumer 예외 발생 시 무한 재시도

Consumer에서 예외가 발생하면 기본적으로 RabbitMQ가 메시지를 다시 `Queue`에 넣는다. 이게 무한 반복되면서 로그가 폭주하는 상황이 발생했다.

해결 방법으로 `retry` 설정을 추가했다.

```yaml
spring:
  rabbitmq:
    listener:
      simple:
        retry:
          enabled: true
          max-attempts: 3
          initial-interval: 1000
          multiplier: 2.0
          max-interval: 10000
```

3번 재시도 후에도 실패하면 메시지를 버리거나, `Dead Letter Queue`로 보내도록 설정하는게 좋다.

#### 3. 직렬화/역직렬화 문제

Producer와 Consumer의 DTO 패키지 경로가 다르면 역직렬화에 실패한다. `Jackson2JsonMessageConverter`를 사용하더라도 `TypeId` 헤더에 클래스 풀네임이 들어가기 때문이다.

```kotlin
@Bean
fun messageConverter(): MessageConverter {
    val converter = Jackson2JsonMessageConverter()
    converter.setTypePrecedence(Jackson2JavaTypeMapper.TypePrecedence.INFERRED)
    return converter
}
```

`TypePrecedence.INFERRED`로 설정하면 헤더의 `TypeId` 대신 메서드 파라미터 타입을 기준으로 역직렬화한다. 멀티모듈 구조에서는 이 설정이 거의 필수다.

### Docker로 RabbitMQ 띄우기

로컬 개발 환경에서는 `Docker`로 간단하게 띄울수있다.

```yaml
# docker-compose.yml
services:
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
```

`15672` 포트로 접속하면 Management UI를 사용할수있다. Queue 상태, 메시지 수, Consumer 연결 상태 등을 실시간으로 확인할수있어서 디버깅할때 정말 유용하다.

### 마무리

`RabbitMQ`를 처음 도입할때 가장 어려웠던건 "누가 Queue를 만드는가" 같은 설계적인 고민이었다. 코드 자체는 Spring AMQP가 잘 추상화 해놔서 어렵지 않았지만, 메시지 유실이나 재시도 정책 같은 운영 관점의 이슈들은 직접 겪어봐야 감이 잡히는것같다. 특히 직렬화 문제는 멀티모듈 환경에서 반드시 한번쯤 마주치게 되니까 미리 설정해두자.
