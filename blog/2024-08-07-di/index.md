---
slug: field
title: 필드주입을 쓰면 안되는 이유를 아시나요?
authors:
  - haeyoung
tags:
  - spring
  - Java
---
### 의존성 주입

- 스프링 프레임워에서 의존성을 주입하는 방법은 3가지가 있다.
	- 생성자 주입(Constructor Injection)
	- 필드 주입(Field Injection)
	- 수정자 주입(Setter, Method Injection)

#### 예제로 알아보자



https://jackjeong.tistory.com/entry/Spring-%EC%83%9D%EC%84%B1%EC%9E%90-%EC%A3%BC%EC%9E%85-vs-%ED%95%84%EB%93%9C-%EC%A3%BC%EC%9E%85-Autowired