# React + SpringBoot(JPA) 활용한 기본 게시판 CRUD 구현

> back(jpa): springmvc/src/main/java/hello/springmvc \
> front(react) : springmvc/src/reactfront \
> sql: springmvc/src/main/resources/sql.sql

## 사용툴
- IntelliJ(Spring Boot)
- VSCode(React)

## 참고 사이트
[구현참고사이트](https://github.com/sosow0212/restApiWithReact/tree/master)

# JPA(Java Persistence API)
- 자바 진영에서 ORM(Object-Relational Mapping) 기술 표준으로 사용되는 인터페이스 모음
- 자바 어플리케이션에서 관계형 데이터베이스를 사용하는 방식을 정의한 인터페이즈
- 인터페이스이므로 Hibernate, OpenJPA 등이 JPA를 구현함
> 이 프로젝트를 구현할 때 사용한 JPA는 JPA를 이용한 spring-data-jpa 프레임워크이지 JPA는 아님

![spring-data-jpa](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbFmukB%2Fbtq0qA03yL7%2FD2Sys7i6RaEBAd6cK0fuFk%2Fimg.png)

## 왜 JPA를 사용해야 하는가
- 반복적인 CRUD SQL을 처리해줌
- 객체 중심의 개발이 가능해짐 -> 생산성이 좋아지고 유지보수가 수월해짐
- 패러다임의 불일치(Java의 상속관계가 데이터베이스에서는 지원되지 않음 등) 해결
    - INSERT 쿼리문으로 변경할 때 상속 관계 혹은 연관 관계를 파악하여 알아서 쿼리문을 작성해줌

## 익혀야 할 사항
### 어노테이션
- @AllArgsConstructor: 클래스의 모든 필드를 인수로 받는 생성자 자동 생성
- @NoArgsConstructor: 기본 생성자 자동 생성
- @Data: 아래 어노테이션을 합친 것
    - @Getter: 모든 필드에 대한 getter 메서드를 자동 생성
    - @Setter: 모든 필드에 대한 setter 메서드를 자동 생성
    - @ToString: toString() 메서드를 자동 생성
    - @EqualsAndHashCode: equals() 및 hashCode() 메서드를 자동 생성
    - @RequiredArgsConstructor: final 필드나 @NonNull이 붙은 필드를 인수로 받는 생성자를 자동 생성
- @Entity: 이 클래스는 JPA 엔티티임을 나타냄(데이터베이스 테이블에 매핑되는 객체)
    > JPA에서 데이터베이스와 객체 간 매핑을 설정하려면 이 어노테이션을 사용해야 함
- @Id: 이 필드는 데이터베이스 테이블의 기본 키(primary key)임을 나타냄
- @GeneratedValue: 기본 키 값을 자동으로 생성하는 방법 지정
    - GenerationType.IDENTITY: 데이터베이스가 자동으로 값을 생성(주로 MySQL, PostgreSQL에서 사용)
    - GenerationType.SEQUENCE: 시퀀스를 사용하여 생성(주로 Oracle, PostgreSQL에서 사용)
    - GenerationType.TABLE: 테이블을 사용하여 생성
    - GenerationType.AUTO: JPA 구현체가 자동으로 선택