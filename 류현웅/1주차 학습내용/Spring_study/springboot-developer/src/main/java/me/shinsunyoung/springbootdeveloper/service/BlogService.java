package me.shinsunyoung.springbootdeveloper.service;

import jakarta.transaction.Transactional;
import me.shinsunyoung.springbootdeveloper.dto.AddArticleRequest;
import me.shinsunyoung.springbootdeveloper.dto.UpdateArticleRequest;
import me.shinsunyoung.springbootdeveloper.repository.BlogRepository;
import me.shinsunyoung.springbootdeveloper.domain.Article;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlogService {

    private final BlogRepository blogRepository;

    // 생성자를 통한 의존성 주입
    public BlogService(BlogRepository blogRepository){
        this.blogRepository=blogRepository;
    }

    // 블로그 글 추가 메서드
    public Article save(AddArticleRequest request){
        return blogRepository.save(request.toEntity());
    }

    // 모든 Article 가져오기
    public List<Article> findAll() {
        return blogRepository.findAll();
    }

    public Article findById(long id){
        return blogRepository.findById(id).orElseThrow(()->new IllegalArgumentException("not found: "+ id));
    }

    public void delete(long id) {
        blogRepository.deleteById(id);
    }


    @Transactional
    public Article update(long id, UpdateArticleRequest request) {
        // ID로 Article 조회
        Article article = blogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + id));

        // Article 필드 업데이트
        article.update(request.getTitle(), request.getContent());

        // 변경된 Article 반환 (Transactional로 인해 자동으로 영속성 컨텍스트에 반영됨)
        return article;
    }
}

// reuest 인자 -> AddArticleRequest 함수에서 기본 생성자가 생성 -> 어떻게 생성되어 있는 거임 ,, ?
