package hello.springmvc.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String content;

//    @JsonManagedReference
//    @OneToOne
//    @JoinColumn(name = "writer")
    private String writer;

    private String writtenDate;
}
