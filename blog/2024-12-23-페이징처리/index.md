---
slug: pagination
title: 페이지네이션에 대해 어디까지 알고있나요?
authors:
  - haeyoung
tags:
  - DB
  - Java
---
`JPA`를 사용하다보면 `Pageble`을 통해 손쉽게 구현하던 페이지네이션을 `Mybatis`로 어떻게 구현할지 고민하고 프로젝트에 적용하며 알게된 내용을 기록하고자 한다. 

## 페이지네이션
대용량 데이터를 다루는 서비스에서 사용자에게 데이터를 보여줄 때, 전체 데이터를 한 번에 가져오는 것은 비효율적이다. 이를 해결하기 위해 페이지네이션(Pagination) 기법을 사용한다.

페이지네이션은 데이터에 번호를 매기고 일부만 가져오는 기법이다. 사용자가 게시판이나 상품 목록을 조회할 때 매번 수십만 건의 데이터를 다 가져오면 속도가 느리고 서버에 부하가 발생한다. 데이터를 조금씩 나누어 필요한 만큼만 가져오는 것이 핵심이다. 이를 구현하는 다양한 방법에 대해서 알아보자. 

### 1. Offset / Limit

Offset 방식은 SQL의 `LIMIT`과 `OFFSET` 예약어를 이용하여 구현한다. 예를 들어 1페이지에 40개의 데이터를 보여준다면, 2페이지에서는 `OFFSET 40 LIMIT 40` 쿼리를 실행한다. 이런 식으로 페이지 번호에 따라 아래와 같이 계산한다. 
```
OFFSET = (페이지 번호 - 1) X 페이지 크기
```

이방식은 구현이 간단하고, SQL 표준문법으로 사용이 가능하며, 정렬 기준이 복잡해도 쉽게 대응이 가능하다. 

하지만 페이지 번호가 커질수록 속도가 저하되어 데이터 건수가 많지 않거나, 페이지가 깊지 않은경우에 사용하는것이 적합하다.

#### JPA
```java
public Page<Post> findAll(Pageable pageable) {
    return postRepository.findAll(pageable);
}
```
이로인해 생성되는 쿼리는 다음과 같다.
```sql
select *
from post
order by created_at desc
limit 40 offset 40;
```

#### Mybatis
```xml
<select id="selectPosts" resultType="Post">
  SELECT *
  FROM post
  ORDER BY created_at DESC
  LIMIT #{pageSize} OFFSET #{offset}
</select>
```

### 2. Cursor
Cursor 방식은 데이터의 특정 키를 기준으로 그 이후의 데이터를 가져오는 방식이다. 예를 들어 `id`가 40인 이후부터 40개의 데이터를 가져오는 쿼리다. 이를 `Seek Method` 또는 `Keyset Pagination`이라고도 불린다.

Cursor 방식은 페이지가 깊어져도 속도가 일정하게 빠르고, 대용량 데이터에서도 안정적이다. 또한 데이터가 자주 변경되더라도 중복이나 누락이 적다. 

하지만 이전페이지 이동이 불가능하고, 구현이 어려우며, 특정 정렬 조건만 가능하다. 해당 방식으로는 대용량 데이터나 SNS 등의 피드 형식, 로그 데이터 처럼 시간순, 무한스크롤 등에 적합한 방식이다.

#### JPA
JPA에서는 Cursor를 직접적으로 지원하지 않지만 조건문을 통해 구현이 가능하다.
```java
@Query("SELECT p FROM Post p WHERE p.id < :cursor ORDER BY p.id DESC")
List<Post> findNextPage(@Param("cursor") Long cursor, Pageable pageable);
```

#### Mybatis
Mapper에서 `WHERE id < #{cursor}` 조건으로 처리한다.
```xml
<select id="selectPostsAfter" resultType="Post">
  SELECT *
  FROM post
  WHERE id < #{cursor}
  ORDER BY id DESC
  LIMIT #{pageSize}
</select>
```

### 3. Hybrid (Offset + Key)
Hybrid 방식은 앞쪽 페이지는 Offset으로 처리하고, 페이지가 깊어지면 Cursor로 전환하는 방식이다. 예를 들어 1~10페이지까지는 Offset, 11페이지부터는 Cursor로 처리한다.

첫페이지들은 UI가 직관적으로 표출되고, 뒤로 갈수록 속도 저하를 방지하기 위해 Cursor를 도입하는 방식으로 사용자 경험과 성능을 균형적으로 사용 가능하다.

하지만 구현이 복잡하고, 어디서부터 Cursor를 사용할지에 대한 기준이 필요하여 
#### JPA
1~10페이지는 Offset, 이후 페이지는 Cursor 방식으로 쿼리를 나눈다.
```java
if (pageNo <= 10) {
    return postRepository.findAll(PageRequest.of(pageNo - 1, pageSize));
} else {
    return postRepository.findNextPage(cursor, PageRequest.of(0, pageSize));
}
```
#### Mybatis
Mapper를 두 개 만들어서 상황에 따라 호출한다.
```xml
-- Offset 방식
<select id="selectPostsOffset" resultType="Post">
  SELECT *
  FROM post
  ORDER BY created_at DESC
  LIMIT #{pageSize} OFFSET #{offset}
</select>

-- Cursor 방식
<select id="selectPostsCursor" resultType="Post">
  SELECT *
  FROM post
  WHERE id < #{cursor}
  ORDER BY id DESC
  LIMIT #{pageSize}
</select>
```

### 4. Bookmark
Bookmark 방식은 클라이언트가 마지막에 본 데이터의 상태(북마크)를 기억하고 요청한다. 북마크 값으로 `id`와 `created_at`을 함께 사용하면 안정성을 높일 수 있다.
#### JPA
```java
@Query("""
SELECT p FROM Post p
WHERE (p.createdAt < :createdAt)
   OR (p.createdAt = :createdAt AND p.id < :id)
ORDER BY p.createdAt DESC, p.id DESC
""")
List<Post> findWithBookmark(@Param("createdAt") LocalDateTime createdAt, @Param("id") Long id, Pageable pageable);

```

#### Mybatis
Mapper에서도 동일하게 `OR` 조건을 쓴다.
```xml
<select id="selectPostsBookmark" resultType="Post">
  SELECT *
  FROM post
  WHERE created_at < #{createdAt}
     OR (created_at = #{createdAt} AND id < #{id})
  ORDER BY created_at DESC, id DESC
  LIMIT #{pageSize}
</select>
```

### 5. Windowing
Windowing 방식은 SQL의 윈도우 함수를 활용해 페이지 단위를 구해 데이터를 제공한다.  
페이지별 순번을 매기고 원하는 페이지만 가져온다.
#### JPA
```java
@Query(value = """
WITH numbered_posts AS (
    SELECT p.*, ROW_NUMBER() OVER (ORDER BY p.created_at DESC) AS row_num
    FROM post p
)
SELECT * FROM numbered_posts
WHERE row_num BETWEEN :start AND :end
""", nativeQuery = true)
List<Post> findByWindow(@Param("start") int start, @Param("end") int end);
```

#### Mybatis
```xml
<select id="selectPostsWindow" resultType="Post">
  WITH numbered_posts AS (
      SELECT p.*, ROW_NUMBER() OVER (ORDER BY created_at DESC) AS row_num
      FROM post p
  )
  SELECT *
  FROM numbered_posts
  WHERE row_num BETWEEN #{start} AND #{end}
</select>
```

### 6. Pre-fetch
Pre-fetch는 실제 쿼리라기보단 전략이다. 사용자가 다음 데이터를 요청하기 전에 미리 조회해 캐싱해두는 방식이다. 서버 또는 CDN에 캐싱해두고 사용자 요청 시 바로 응답한다.