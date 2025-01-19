package me.shinsunyoung.springbootdeveloper.dto;

public class UpdateArticleRequest {
    private String title;
    private String content;

    // 기본 생성자
    public UpdateArticleRequest() {
    }

    // 매개변수가 있는 생성자
    public UpdateArticleRequest(String title, String content) {
        this.title = title;
        this.content = content;
    }

    // Getter 메서드
    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }
}
