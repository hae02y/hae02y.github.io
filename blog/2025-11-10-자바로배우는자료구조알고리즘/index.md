---
slug: java-algorithm-book
title: 자바로 배우는 자료구조 알고리즘 정리
authors:
  - haeyoung
tags:
  - review
  - book
  - Java
  - algorithm
---

이 내용은 '자바로 배우는 자료구조 알고리즘' 책을 읽고 내용을 정리한 내용이다. 해당 내용에 대한 실습 및 예제 코드는 아래 깃허브 링크를 참고하면 된다.

[깃허브 Repo](https://github.com/hae02y/Blog-Code-Repo/tree/main/think-data-structures)

### LinkedList 클래스

ArrayList의 이점은 get, set 메서드에서 나온다. LinkedList는 심지어 이중연결리스트인 경우에도 선형 시간이 필요하다.

만약 프로그램의 실행시간이 get, set에 의존한다면 ArrayList는 좋은 선택이다, 실행시간이 시작, 끝 근처의 요소에 추가 삭제 연산에 의존한다면 LinkedListrk 좋은 선택이다.

이외에 고려할 요소는

1. 연산이 응용프로그램의 실행시간에 뚜렷한 영향을 미치지 않는다면 List 구현에 대한 선택은 의미없음
2. 작업하는 리스트가 매우 크지않으면 큰 성능차이를 얻기 어렵다. 작은 문제에서는 이차 알고리즘이 선형알고리즘보다 빠르기도 하고, 또 선형알고리즘이 상수시간보다 빠르기도 하다. 즉 작은 문제에서는 이러한 차이가 큰 의미를 두지 않는다.
3. 공간에 대해서도 잊지 말아야한다. ArrayList에서는 배열 기반으로 요소들은 한덩어리의 메모리안에서 나란히 저장되어 거의 낭비되는 공간이 없고, 컴퓨터 하드웨어도 연속된 공간에서 연산속도가 종종 더 빠르다. LinkedList에서 각 요소는 하나 혹은 두개의 참조가 있는 노드가 필요하고, 참조는 공간을 차지한다. 또한 메모리 여기저기에 노드가 흩어지면 하드웨어의 효율이 떨어진다.

### 성능 측정

JavaFX 라이브러리 사용해서 한번 그려보자.

### 트리순회

- 철학으로 가는길
- Jsoup 사용 크롤링
	- ref . [https://jsoup.org/download](https://jsoup.org/download)


Q: Stack과 같은 자료형은 List보다 더 적은 메서드를 가지는데 굳이 써야하는가?

1. 메서드 개수를 작게 유지하면, 코드의 가독성 향상, 오류 발생 가능성 감소
2. 자료구조에서 작은 API를 제공하면, 효율적인 구현이 쉬움. 스택을 구현하는 단순한 방법은 단일 연결 리스트를 사용. 요소를 스택에 push하면 리스트의 시작에 요소를 추가. pop하면 시작에서 요소를 제거. 연결리스트에서 시작에 요소를 추가 삭제 하는건 상수시간 연산이므로 구현이 효율적임
3. ArrayDeque나 Deque 인터페이스를 구현한 클래스를 사용하는것이 가장 좋은 방법


### 철학으로 가는길

#### Iterable 과 Iterator

Iterable, Iterator는 컬렉션을 순회하기위해 사용하는 두가지 중요한 인터페이스다.

![iterable 상속 구조](screen1.png)

#### Iterable

 자바에서 반복가능한 객체를 나타내는 인터페이스. 이를 구현한 클래스로는 for-each문을 사용하여 요소 순회가 가능. `Iterator<T>` iterator() : Iterable 인터페이스의 핵심 메서드로, 이를 통해 Iterator 객체를 반환한다. 이 메서드를 구현함으로써, 컬렉션 클래스는 반복 가능한 객체로 사용할 수 있게 된다.

```java
import java.util.ArrayList;
import java.util.List;

public class IterableExample {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("apple");
        list.add("banana");
        list.add("cherry");

        // for-each 문을 사용하여 순회
        for (String item : list) {
            System.out.println(item);
        }
    }
}
```

#### Iterator 인터페이스

 이터레이터는 컬렉션의 요소를 순차접근하기위한 인터페이스로 Iterator는 Iterable이 제공한 컬렉션을 직접 탐색하며, 각 요소에 접근할수있는 방법을 제공한다. Iterator를 사용하면 컬렉션의 각요소를 직접 제어하며 순회 가능하다.
 -  **boolean hasNext()** : 다음 요소가 있는지 확인한다. 요소가 남아 있으면 true, 아니면 false를 반환한다.
- **T next()** : 다음 요소를 반환하며, 현재 위치를 다음으로 이동시킨다.
- **void remove()** : 현재 Iterator가 가리키고 있는 요소를 제거한다. (선택적 메서드로, 모든 Iterator에서 반드시 구현해야 하는 것은 아니다)

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class IteratorExample {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("apple");
        list.add("banana");
        list.add("cherry");

        // Iterator를 사용하여 순회
        Iterator<String> iter = list.iterator(); // iterator 객체를 얻는다
        while (iter.hasNext()) {
            String item = iter.next();
            System.out.println(item);
        }
    }
}
```
위의 코드에서 iterator() 메서드를 호출하여 Iterator 객체를 얻고, while 문을 사용해 hasNext()로 다음 요소가 있는지 확인하면서 next()를 통해 요소를 가져온다.

둘의 차이점
- Iterable : 순회 할수있는 객체를 의미, Iterator() 메서드를 통해 Iterator를 생성, for-each를 통해 컬렉션을 간결하게 순회가능
- Iterator : 실제로 순회작업을 수행하는 객체로 컬렉션요소에 하나씩 접근 가능, 직접 요소를 순회하며 특정조건에 따라 요소를 제거하거나 순회 과정을 세밀하게 제어 가능

### DFS 구현 방법 2가지

- DFS는 깊이우선탐색으로 트리의 루트에서 시작하여 첫번째 자식노드를 선택하고 선택된 노드가 자식을 가지고 있다면 첫번째 자식을 다시선택, 반복후 자식이 없는 노드에 도착하면 부모노드로 거슬러 올라가 다음자식이 있다면 그쪽으로 이동하는 식으로 동작한다.
![dfs 순서](screen2.png)
### 방법1. 재귀적 방법

메서드의 루트에서 시작해서 트리에 있는 모든 노드를 호출할때까지 반복된다. 아래 구현 코드를 보면 자식노드를 탐색하기전 `TextNode`의 내용을 출력하므로 전위순회에 해당한다.

```java
private static void recursiveDFS(Node node) {  
    if (node instanceof TextNode) {  
        System.out.print(node);  
    }  
    for (Node child: node.childNodes()) {  
        recursiveDFS(child);  
    }  
}
```


### 방법2. 반복적 방법

반복적 방법으로 구현을 할때는 `Stack` 자료구조를 통해 구현이 가능하다. 반복적인 방법으로 구현을 알아보기에 앞서서 스택이라는 자료구조를 아래에 간단히 정리해보자.

스택은 리스트와 유사한 자료구조형으로 요소의 순서를 유지하는 컬렉션이다. 스택의 `pop`메서드는 항상 최상단의 요소를 반환하므로 스택은 `LIFO` 자료구조 이다. 이에 반해 큐 자료구조는 `FIFO` 이다.  일반적인 규약에서 제공하는 스택의 메서드는 다음과 같다.

- `push` : 스택의 최상단에 요소를 추가
- `pop` : 스택의 최상단에 있는 요소를 제거하고 반환
- `peek` : 최상단 요소를 반환하지만 요소는 그대로 둠
- `isEmpty` : 스택이 비었는지 알려줌

```java
private static void iterativeDFS(Node root) {  
    Deque<Node> stack = new ArrayDeque<Node>();  
    stack.push(root);  
  
    while (!stack.isEmpty()) {  
  
        Node node = stack.pop();  
        if (node instanceof TextNode) {  
            System.out.println(node);  
        }  
  
        List<Node> nodes = new ArrayList<Node>(node.childNodes());  
        Collections.reverse(nodes);  
  
        for (Node child: nodes) {  
            stack.push(child);  
        }  
    }  
}
```

### 인덱스

> Index는 인덱스란 검색 속도를 향상시키기 위한 자료구조이다.

인덱스는 조회 연산이다. 가장 단순한 구현은 페이지의 컬렉션이다. 검색어가 주어지면 페이지의 내용을 반복 조사하여 검색어를 포함하는 페이지를 선택하는 방법이다. 하지만 실행시간이 모든 페이지의 전체 단어수에 비례하여 매우 느리다. 

이보다 나은 대안으로 Map 자료구조를 활용해보자. Map은 키-값 쌍의 컬렉션으로 키와 키에 해당하는 값을 찾는 빠른 방법을 제공한다. 자바의 Map 인터페이스는 맵을 구현하는데 필요한 메서드를 정의한다.

- `get(key)` : 키를 조사하여 관련된 값을 반환
- `put(key,value)` :  Map에 새로운 키-값을 추가하거나 이미 있는 키면 값을 업데이트 한다.

자바 Map 인터페이스는 몇가지의 구현을 제공하는데 이중 