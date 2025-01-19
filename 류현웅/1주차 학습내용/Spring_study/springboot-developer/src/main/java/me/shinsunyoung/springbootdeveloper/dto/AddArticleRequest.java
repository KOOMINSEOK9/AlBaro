//Data Transfer Object로 계층 간 데이터 교환에 사용.
//AddArticleRequest, ArticleResponse, UpdateArticleRequest: 클라이언트 요청/응답 처리.

package me.shinsunyoung.springbootdeveloper.dto;

import me.shinsunyoung.springbootdeveloper.domain.Article;

public class AddArticleRequest {

    private String title;
    private String content;

    // 기본 생성자
    public AddArticleRequest(){
    }

    // Getter, Setter
    public String getTitle(){
        return title;
    }

    public void setTitle(String title){
        this.title=title;
    }

    public String getContent(){
        return content;
    }

    public void setContent(String content){
        this.content=content;
    }

    // toEntity 메서드
    public Article toEntity(){
        return new Article(title,content); // 생성자를 직접 호출
    }

}
