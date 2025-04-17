---
slug: trywithresources
title: try-with-resources 를 사용하자!
authors:
  - haeyoung
tags:
  - Java
---

### try-with-resources

`try-with-resources`는 Java7에서 도입된 기능입니다. 자원을 자동으로 관리하고 자원누수를 방지하는 역할을 합니다.

#### 개념
`try-with-resources`는 **`AutoCloseable`** 또는 **`Closeable`** 인터페이스를 구현한 객체들을 자동으로 닫아주는 기능을 제공하며 아래와 같은 작업에서 자원관리를 합니다.

- 파일 처리
- 네트워크 연결
- 데이터베이스 연결

`try-with-resources` 블록 내에서 **자원**을 열고 사용하며, 그 후 자원이 **자동으로 닫히도록 보장**합니다. 기존의 방식에서는 `finally` 블록을 사용하여 자원을 명시적으로 닫아야 했는데, `try-with-resources`는 이를 자동으로 처리해 줍니다.

`Java7`이전에는 `try-catch-finally`에서 finally에 `close()`를 호출하여 메모리 누수를 막아줘야했다.


---
#### 참고
- [망규블로그](https://mangkyu.tistory.com/217)