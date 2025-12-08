---
slug: rabbitmq
title: 레빗엠큐 구성하면서 어려웠던거
authors:
  - haeyoung
tags:
  - review
  - bootcamp
---

자 A가 Publish(발행) B가 Consume(구독)한다면, A는 큐의 존재를 알필요가 없다. 그저 exchange에다가 넣어두면 구독자가 스스로 내가 어떤큐를 소비할지를 정하면 된다. 즉 큐를 만드는 주체는 B가 된다. 아래 소비 시나리오를 참고하자.

1. B 서버가 실행됨
2. “나는 APT001/B1 데이터를 소비한다” → Queue + Binding 생성
3. A서버는 routingKey만 보고 발행
4. RabbitMQ가 그때 만들어진 Queue로 메시지 라우팅
5. B서버 가 안정적으로 소비

> 레빗엠큐 기본철학 
> "발행자는 Queue 이름을 몰라야 한다." Queue는 Consumer(Application that receives messages)가 선언해야 한다. Producer는 Exchange + Routing Key만 알면 충분하다.

