//엔티티 클래스 포함.
//Article: 데이터베이스 테이블과 매핑되는 JPA 엔티티.

package me.shinsunyoung.springbootdeveloper.domain;

import jakarta.persistence.*;
import lombok.Builder;

@Entity
public class Article {

    @Id  // id 필드를 기보니로 지정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본키를 1씩 자동으로 추가
    @Column(name="id",updatable=false)

    private Long id;

    @Column(name="title", nullable=false)
    private String title;

    @Column(name="content", nullable=false)
    private String content;

    @Builder // 빌더 패턴으로 객체 생성
    public Article(String title, String content){
        this.title=title;
        this.content=content;
    }

    // 기본 생성자 (JPA가 사용 ,,, ?)
    protected Article(){
    }

    // 게터
    public Long getId(){
        return id;
    }

    public String getTitle(){
        return title;
    }

    public String getContent(){
        return content;
    }

    public void update(String title, String content){
        this.title=title;
        this.content=content;
    }

}



//Article, AddArticleRequeset Getter 역할 차이 뭔가요 ,, ?