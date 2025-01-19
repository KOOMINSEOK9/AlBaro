//repository
//데이터베이스 CRUD 작업을 담당.
//BlogRepository: JPA 인터페이스 상속.

package me.shinsunyoung.springbootdeveloper.repository;
import me.shinsunyoung.springbootdeveloper.domain.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository extends JpaRepository<Article, Long>{
}
