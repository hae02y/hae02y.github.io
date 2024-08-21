---
slug: stack
title: 스택오버플로우 포트폴리오
authors: [hae02y]
tags: [portfolio]
---


![image](https://github.com/hae02y/hae02y/assets/59853998/5b2a88c4-53a4-4cb5-88ed-fcc2ddac3f7a)


### 🎉 프로젝트 소개

**프로젝트 이름 : [StackOverFlow Clone](http://pre016client.s3-website.ap-northeast-2.amazonaws.com/)**

**프로젝트 기간 : 2023.08.04 ~ 2023.08.23 (2주)**

**프로젝트 인원** : **Backend 3명, Frontend 3명 (총 6명)**

**프로젝트 설명 : 스택오버플로우 클론 코딩입니다. 로그인 및 게시판 CRUD를 구현하였습니다.**

📜 **Link**

[- 🧷 Github](https://github.com/hae02y/seb45_pre_016)

[-🧷 API 명세서](https://documenter.getpostman.com/view/14800466/2s9Y5R1ko2)

[- 🧷 화면 정의서](https://www.figma.com/file/a9iJHlhwkUkSP3XS5wHprF/per_16_%EC%9D%BC%EB%8B%A8%F0%9F%8C%9E%EB%B3%B4%EC%A3%A0_%ED%99%94%EB%A9%B4%EC%A0%95%EC%9D%98%EC%84%9C?type=design&node-id=0-1&mode=design&t=KILS3yiTmhFAPtdg-0)


---

### 🛠 내가 사용한 스택

- **Java**
- **Spring Boot**
- **Spring data JPA**
- **AWS**
- **Github Action**
- **H2 Database**
- **MySQL**
- **Postman**

---

### 📂 내 역할

⚙ Frontend 3명, Backend 3명이서 함께 진행한 프로젝트에서 **팀장** 역할을 맡았습니다. 
처음 진행한 협업 프로젝트여서 많이 걱정되었지만 걱정과 다르게 모두 열심히 **협동**하여 프로젝트를 기간 내로 잘 끝낼 수 있었습니다.


프로젝트를 진행하면서 **제가 구현했던 역할**은 아래와 같습니다.

- DB 설계 및 API 문서 작성
- 질문 CRUD 구현
- 답변 CRUD 구현
- 태그 CRUD 구현
- CI/CD (AWS EC2 + Github Action)
- MySQL DB서버 연동(AWS RDS 사용)

---

### 🔊 구현 설명

 제가 사용한 **Java version**은 **11.0.2**를 사용하였고, **Spring Boot** 는 **2.7.14** 를 사용하였습니다. 자바 11의 경우 **LTS 버전**이고, 자바 8보다 많은 기능을 지원하여 11버전을 선택하였습니다.

그리고 DB의 경우에는 개발 과정에서 **H2 DB**를 사용하였고, CI/CD 이후에 AWS RDS의 **MySQL DB**를 사용하였습니다. 



#### **DB 설계 및 API 문서 작성**

![image](https://github.com/hae02y/hae02y/assets/59853998/7c32cf5b-4f3e-4cbe-bbe8-b8a417c62664)

- **DB 설계**
    
    팀원들과의 소통을 위해서 [노션페이지](https://www.notion.so/da0f924e6d454c79ab455547eb110e08?pvs=21)와 디스코드로 소통을 하면서 작업을 하였습니다. 프로젝트에 들어가기전 사이트의 요구사항을 파악하기 위해 **요구사항 명세서를 작성**하였고, 그에 따라 역할을 분배하였습니다. 먼저 팀원들과 함께 **ERD 다이어그램**과 **API명세서**를 작성하였습니다.
    
    
    회원과 질문의 경우 회원 1명이 여러 개의 질문을 작성하거나 아예 작성하지 않을 수도 있고, 답변의 경우도 회원과의 관계는 마찬가지이며 질문 1개에 답변이 여러 개 달릴 수 있으므로 위와 같이 설계하였습니다. 태그는 질문에 여러 개가 달릴 수 있는 형태로 설계하였습니다. **N:M** 관계인 태그와 질문의 관계를 **1:N** **1:M**으로 나누기 위해 **질문태그(QuestionTag)를 생성**하였습니다.
    

- **API 문서**
    
    API문서는 **Swagger**와 **PostMan**을 고민하였습니다. 저희는 구현에 앞서 문서를 작성하는 시간이 있었기에, 개발 코드를 바탕으로 API문서를 생성하는 Swagger 보다 문서를 작성 후에 활용 가능한 Postman을 활용하여 문서를 작성하였습니다. 먼저 문서 작성을 하게 되니 API구성의 뼈대를 잡을 수 있었고, **API 통신의 테스트 용도**로 Postman을 사용했기 때문에 **접근이 편했습니다.**  
    
    [**[API 명세서]**](https://documenter.getpostman.com/view/14800466/2s9Y5R1ko2)
    
    작성에는 팀원 모두가 참여하여 작성하였고 각자 본인의 도메인을 작성하였습니다. 저는 질문, 답변, 태그의 API 문서를 작성하였는데 API문서가 **프론트엔드와 소통하는 엔드포인트**라는 점을 한번 더 알 수 있었습니다. 작성을 위해 **RESTful**한 API 작성 방법을 많이 찾아보았고, 어떤 식으로 작성하는 것이 좋은 API인지 알 수 있었습니다. 


#### **질문, 답변, 태그 CRUD 구현**

- **질문 조회수 기능**
    - 질문 게시글에 조회수 기능을 추가하였습니다. **Get 요청**으로 findQuestion에 접근시 viewCountUp 메서드에서 **조회수의 증가를 구현**하였습니다. 하지만 findQuestion에서 레포지토리에 save가 일어나는 방식으로 구현을 하여서 추후에 방식을 변경해보려고 합니다.
    
    ```java
    //QuestionService.java
    
    public Question findQuestion(Long questionsId) {
            Question question = questionRepository.findById(questionsId)
                    .orElseThrow(() -> new BusinessLogicException(ExceptionCode.QUESTION_NOT_FOUND));
            viewCountUp(question);  // -> 조회수
            questionRepository.save(question);
    
            return question;
        }
    
    //조회수 증가(get Question)
        private static void viewCountUp(Question question) {
            Long view = question.getViews();
            question.setViews(++view);
        }
    ```
    
- **TimeStamp 구현**
    - 게시글과, 답변, 유저의 생성에 있어서 생성시간과 삭제시간이 공통적으로 구현이 되었습니다. 중복을 제거하기 위해서 TimeStamp 클래스를 구현하여 Entity에 상속하여 사용하는 방식을 택했습니다.
    
    ```java
    //TimeStamp.class
    
    @Getter
    @Setter
    @MappedSuperclass
    @EntityListeners(AuditingEntityListener.class)
    public class TimeStamp {
    
        @CreatedDate
        @Column(updatable = false)
        private LocalDateTime createdAt;
    
        private LocalDateTime modifiedAt = LocalDateTime.now();
    }
    ```
    
    ```java
    //Question.class
    
    @Entity
    @Getter
    @Setter
    public class Question extends TimeStamp {
    ...
    }
    ```
    
    위와 같이 **Question.class**에서 **TimeStamp를 상속**하여 사용하였습니다. 아쉬운 부분은 modifiedAt의 경우 LocalDateTime을 직접 할당해줬는데, 위의 조회수 구현 부분에서 Get요청이 발생할 때 **JPA Auditing 기능이 활성화** 되어, **modifiedAt**이 **바뀌는 이슈**가 있어 적용하였습니다. 이는 추후에 다른 방법으로 리팩터링하고 싶습니다.


    

#### **CI/CD (AWS EC2 + Github Action)**

![image](https://github.com/hae02y/hae02y/assets/59853998/c2eddcae-a810-477d-957b-7ea91c31564f)

CI/CD는 처음 진행하다 보니 어려운 점이 많았습니다. 아래와 같은 방식으로 구현을 하였습니다. Jenkins의 사용을 고려했었는데 **프로젝트의 규모나 시간 등을 고려** 했을 때 **Github Action**이 프로젝트에 적합하다고 판단하여 진행하였습니다. 

Github 레포지토리의 **main으로 push**하게 되면 github Action이 **작동**하게 되고, AWS의 **CodeDeploy**를 통해 **EC2에 배포와 실행이** 되는 방식으로 구현을 하였습니다. 

```yaml
name: CI-CD

on:
  push:
    branches:
      - main
  workflow_dispatch:

  pull_request:
    branches:
      - main

env:
  S3_BUCKET_NAME: pre016
  RESOURCE_PATH: server/src/main/resources/application.yml
  CODE_DEPLOY_APPLICATION_NAME: pre016-codedeploy-app
  CODE_DEPLOY_DEPLOYMENT_GROUP_NAME: pre016-codedeploy-deployment-group

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Set up JDK 11
        uses: actions/setup-java@v3
        with:
          java-version: 11
          distribution: 'temurin'

    # appspec.yml, scripts(start.sh, stop.sh)디렉토리 복사
      - name: Copy appspec.yml to current directory
        run: |
            cp server/appspec.yml .
            cp -r server/scripts .
        shell: bash

      - name: Build with Gradle and print build result
        run: |
          cd server
          chmod +x gradlew
          ./gradlew build -x test
        shell: bash

      - name: Copy jar file to current directory
        run: cp server/build/libs/*.jar .
        shell: bash

      - name: Make zip file
        run: zip -r ./$GITHUB_SHA.zip .
        shell: bash

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Upload to S3
        run: |
          aws deploy push \
            --application-name ${{ env.CODE_DEPLOY_APPLICATION_NAME }} \
            --ignore-hidden-files \
            --s3-location s3://$S3_BUCKET_NAME/$GITHUB_SHA.zip \
            --source .

      - name: Code Deploy
        run: |
          aws deploy create-deployment \
          --application-name ${{ env.CODE_DEPLOY_APPLICATION_NAME }} \
          --deployment-config-name CodeDeployDefault.AllAtOnce \
          --deployment-group-name ${{ env.CODE_DEPLOY_DEPLOYMENT_GROUP_NAME }} \
          --s3-location bucket=$S3_BUCKET_NAME,key=$GITHUB_SHA.zip,bundleType=zip
```

**CI/CD** 를 구현하면서 **Github Action을 사용**해볼 수 있는 좋은 기회였습니다. **CI/CD**를 구현하는 **Flow가 정말 다양**하다는 것을 알게 되었고 기회가 된다면 다른 방식으로 구현해 보고 싶었습니다. 그리고 yml을 작성하는 방법도 공부하였습니다. **yml**의 경우에도 배열 등을 표현할 수 있다는 것을 알았습니다. 이와 관련하여 **블로그에 기록**해 두었습니다. 

**[[XML / JSon / YAML](https://togll.tistory.com/216)]**



#### **MySQL DB서버 연동(AWS RDS 사용)**

![image](https://github.com/hae02y/hae02y/assets/59853998/a7e45198-dc85-41b2-9ba9-bee94bfa504e)

개발단계에서 **H2 DB를 사용**하다보니, 서버가 재기동 되면 **데이터가 초기화** 되었습니다. 이를 위해 **MySQL**을 고려하였습니다. 이때 저희에게 선택할 수 있는 방법은 **RDS**를 사용하는 방법과 **EC2에 직접 MySQL을 설치**하여 운영하는 방법이 있었습니다. 저는 RDS를 한번 **경험**해보고 싶었습니다. 그래서 RDS를 선택하였고, RDS를 사용시에 얻게 되는 장점에 대해 공부할 수 있었습니다. 하지만 RDS사용하게 되니 비용에 대한 부담이 생겼습니다. 그래서 현재는 RDS DB를 내려놓은 상태이고, EC2에 직접 설치하여 리팩토링 작업에 사용 할 계획을 세우고 있습니다.

---

### 💡 **어려웠던 점 / 배운 점**


#### **MappedBy 에러**

**Spring Data JPA**의 **mappedBy**를 작성하는 것에 어려움이 있었습니다. 이를 해결하기 위해서 **테이블의 연관관계**에 대한 공부를 하였고, **양방향 매핑**시에 둘중 하나가 **외래키를 관리**해야하고 이는 연관관계의 **주인**(Owner)이 해야한다는 것을 알았습니다. 이때 Owner는 mappedBy 속성을 사용하지 않고, **Owner가 아니면 mappedBy속성을 사용**합니다.



#### **순환참조 에러**

```java
@Entity
@Getter
@Setter
public class Question extends TimeStamp {

		... 

    @JsonIgnore //순환참조 발생하여 stackoverflow 에러남 > JsonIgnore 사용해서 없애준다
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<Answer> answers = new ArrayList<>();

    @JsonIgnore //순환참조 발생하여 stackoverflow 에러남 > JsonIgnore 사용해서 없애준다
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<QuestionTag> questionTags = new ArrayList<>();

}
```

OneToMany 관계에서 Get요청으로 조회시에 **순환참조에러**가 발생하였습니다. 이를 방지하기 위해서 **@JsonIgnore**를 사용하여 방지해줬습니다. 



#### **H2 DB 예약어 에러**

최초의 테이블설계시에 회원을 User로 설계하였습니다. 이때, 개발과정에서 사용했던 H2 DB의 예약어와 충돌하는 문제가 발생하였습니다. 

```java
Caused by: org.h2.jdbc.JdbcSQLSyntaxErrorException: Syntax error in SQL statement "insert into [*]user 
(id, created_at, deleted_at, last_modified_at, password, role, user_name) values 
(default, ?, ?, ?, ?, ?, ?)"; expected "identifier"; SQL statement:
insert into user (id, created_at, deleted_at, last_modified_at, password, role, user_name) values (default, ?, ?, ?, ?, ?, ?) [42001-214]
```

위와 같은 에러가 발생하였고, 이를 해결하기 위해서 User → Users로 테이블명을 변경하였습니다.

@Table어노테이션을 적용하여 변경하였습니다. 이를 통해 테이블을 설계 할 때 **올바른 명칭을 정하는 것**이 얼마나 **중요**한지 알 수 있었습니다.



#### **Validation 에러 [[블로그 정리 보기]](https://togll.tistory.com/205)**

```java
@NotBlank
private long password;
```

위와 같이 작성했더니 에러가 발생하였습니다. 이유는 **long타입, int타입**등의 **원시타입**에 대해서는 **@NotBlank** 애너테이션을 사용할수없고 만약 유효성검사가 필요하다면 **@Min, @Max**등의 최소, 최대값을 지정하는 방식으로 사용이 가능합니다. 이를 통해 **사소한 부분에서도 문제가 발생**할 수 있다는 것을 알았습니다. Dto를 작성할때 붙여넣기를 하였는데 좀 더 신경을 써야겠다고 생각하였습니다.



#### **CORS 에러**

![image](https://github.com/hae02y/hae02y/assets/59853998/20df5d84-9b9c-4132-855e-b11f4180a376)

프론트와 연동하여 테스트를 진행하는 과정에서 정말 많은 **cors에러**가 발생하였습니다. 
setAllowedOrigins 와 setcredential 함께 사용 못 하는 것을 알았고, 이를 적용하여 corsFilter 넣어서 test는 성공하였습니다. 이외에도 거의 모든 테스트 진행 시에 Cors에러가 발생하였는데, 백엔드도 **처음 협업을 진행**하는 상황이었고, 프론트도 처음 협업을 진행 하다 보니 어디가 문제인지 정확히 파악할 수가 없어서 일어나는 문제가 대부분 이였습니다. 이를 해결하기 위해서 프론트와 거의 날이 새도록 하나씩 테스트를 진행 하였고 결국 문제를 해결할수있었습니다. 이를 통해서 초보 개발자들이 가장 애를 먹는다는 **Cors**에 대해서 한번 더 알게 되었고, 어떤 식으로 해결해야 하는지, 그리고 어느 부분을 집중해서 확인 해야 하는지 알 수 있었습니다. 특히 **preflight 요청**에 대해서 자세히 공부할 수 있었습니다.

---

#### 📃 **기록**

1. [프로젝트 회고 블로깅](https://togll.tistory.com/235)
2. [시스템 구현 블로깅](https://togll.tistory.com/234)
3. [시스템 설계 블로깅](https://togll.tistory.com/231)