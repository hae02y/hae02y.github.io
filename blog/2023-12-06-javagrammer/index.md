---
slug: method-reference
title: 자바 메서드 참조를 사용하자
authors:
  - haeyoung
tags:
  - Java
---

> _"코드는 짧아지지만 의미는 더 명확하게."_  
> 이 글은 Java의 `메서드 참조` 기능을 단순히 “람다의 축약형”이 아니라, **더 읽기 쉽고 유지보수하기 쉬운 표현 방식**으로 이해하고 **실무에서 전략적으로 활용**하기 위한 내용을 담고 있습니다.

---

## 🔍 1. 메서드 참조란?

Java 8부터 등장한 **메서드 참조(method reference)**는 람다 표현식을 **간결하게 표현**할 수 있도록 만든 문법입니다.  
람다식을 간략화한 것 같지만, 사실은 그 이상입니다. **함수형 인터페이스를 구현하는 완전한 함수 포인터 표현**이며, 가독성과 유지보수성을 비약적으로 높여주는 도구입니다.

java

복사편집


```java
list.forEach(s -> System.out.println(s));// 람다 표현식    
```

```java
list.forEach(System.out::println);// 메서드 참조
```

---

## 🧠 2. 메서드 참조의 4가지 타입

|형태|예시|대응하는 람다식|설명|
|---|---|---|---|
|1. 정적 메서드 참조|`ClassName::staticMethod`|`x -> ClassName.staticMethod(x)`|클래스의 static 메서드 참조|
|2. 특정 객체의 인스턴스 메서드 참조|`instance::method`|`x -> instance.method(x)`|이미 존재하는 객체의 메서드|
|3. 특정 타입의 인스턴스 메서드 참조|`ClassName::instanceMethod`|`(obj, arg) -> obj.instanceMethod(arg)`|인스턴스를 추후 받는 형태|
|4. 생성자 참조|`ClassName::new`|`() -> new ClassName()`|객체 생성 람다식 단축|

### 📌 예시별 코드

java

복사편집

`// 1. 정적 메서드 참조 Function<String, Integer> parser = Integer::parseInt; // 동일한 람다: s -> Integer.parseInt(s)  // 2. 특정 객체의 인스턴스 메서드 참조 PrintStream ps = System.out; Consumer<String> printer = ps::println;  // 3. 특정 타입의 인스턴스 메서드 참조 BiPredicate<String, String> equals = String::equals; // 동일한 람다: (a, b) -> a.equals(b)  // 4. 생성자 참조 Supplier<List<String>> listSupplier = ArrayList::new; // 동일한 람다: () -> new ArrayList<>()`

---

## 🔬 3. 실무에서 람다 vs 메서드 참조 – 언제 쓰는 게 좋을까?

### ✅ 메서드 참조가 **유리한 상황**

- **이미 존재하는 메서드를 전달할 때**
    
- **람다 내용이 메서드 호출 1줄뿐일 때**
    
- **코드 가독성이 중요한 서비스 레이어**
    
- **테스트 코드 (Mock 메서드 주입 시)**
    

java

복사편집

`// 가독성 상승 Optional.of("haeyoung")         .map(String::toUpperCase)         .ifPresent(System.out::println);`

### ❗️람다가 더 나은 경우

- **비교 로직이 복잡할 때**
    
- **컨텍스트를 추가로 잡아야 할 때**
    
- **익명 구현이 필요할 때**
    

java

복사편집

`// 커스텀 로직 포함 시 람다가 유리 list.sort((a, b) -> a.length() - b.length());`

---

## 🛠 4. Functional Interface에 대한 이해는 필수

메서드 참조는 반드시 **함수형 인터페이스(Functional Interface)**에 매핑될 수 있어야 합니다.

java

복사편집

`@FunctionalInterface public interface Converter<F, T> {     T convert(F from); }  // 메서드 참조 적용 Converter<String, Integer> converter = Integer::parseInt;`

컴파일러는 `Integer::parseInt`가 `String → Integer` 형태라는 걸 알고 `Converter<String, Integer>`에 자동 매핑해줍니다.

---

## ⚙️ 5. 메서드 참조의 내부 원리

- JVM은 `MethodHandle` 기반으로 람다/메서드 참조를 런타임에 **동적 생성 (invokedynamic)** 합니다.
    
- 성능 측면에서는 일반 람다와 거의 동일하나, 메서드 참조는 **더 많은 최적화 가능성**을 제공해 JIT 컴파일 시 유리합니다.
    
- 내부적으로는 **Synthetic Lambda Class**가 생성되지 않아 **GC 부담도 줄어듭니다** (특히 반복 호출 시 유리).
    

---

## 🧪 6. 테스트 / 디버깅 팁

|상황|해법|
|---|---|
|디버깅 중 어떤 메서드를 참조했는지 모를 때|IDE에서 메서드 참조 위에 마우스를 올려 확인 or `Navigate to Declaration`|
|`NoSuchMethodException`, `IllegalArgumentException` 발생 시|메서드 시그니처와 Functional Interface의 시그니처가 **정확히 일치하는지** 확인|
|익명 메서드로 전달해야 할 때|람다로 먼저 구현 후 → 가능하면 메서드 참조로 리팩토링|

---

## 🚀 7. 실전에서 이렇게 씁니다 (예제 Best Practice)

### 📌 스트림 파이프라인

java

복사편집

`List<String> names = List.of("haeyoung", "kevin", "min");  List<Integer> lengths = names.stream()         .map(String::length)         .collect(Collectors.toList());`

### 📌 스프링 컨트롤러 응답 변환

java

복사편집

`@GetMapping public List<UserDto> getUsers() {     return userService.findAll()                       .stream()                       .map(UserDto::fromEntity) // 정적 팩토리 메서드 참조                       .toList(); }`

### 📌 Optional 활용

java

복사편집

`Optional<User> user = findUserById("123");  user.map(User::getName)     .ifPresent(System.out::println);`

---

## ✅ 정리 – 실무에서 메서드 참조를 쓸 때 이렇게 판단하세요!

|판단 기준|람다|메서드 참조|
|---|---|---|
|**복잡한 로직**|✅|❌|
|**이미 존재하는 함수 호출만 할 경우**|❌|✅|
|**가독성 강조**|❌|✅|
|**디버깅 중 커스텀 로그 추가**|✅|❌|
|**단순 파이프라인 or 팩토리 생성**|❌|✅|

---

## 📎 결론

- 메서드 참조는 람다의 축약이 아닌 **함수 전달의 철학**입니다.
    
- 실무에선 **단순한 로직일수록 메서드 참조**, 복잡한 컨텍스트/커스텀 로그가 필요할 땐 람다를 사용하세요.
    
- Spring 기반 애플리케이션에서는 DTO 변환, 이벤트 핸들러 등록, 스트림 API에서 **적극 사용 시 생산성과 가독성이 매우 향상됩니다.**