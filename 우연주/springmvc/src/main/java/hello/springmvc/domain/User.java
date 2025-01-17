package hello.springmvc.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

//@AllArgsConstructor
@NoArgsConstructor
//@Data
@Getter
@Entity
public class User {

    @Id
    private String id;
    private String password;
    private String name;

    @Builder
    public User(String id, String password, String name) {
        this.id = id;
        this.password = password;
        this.name = name;
    }
}
