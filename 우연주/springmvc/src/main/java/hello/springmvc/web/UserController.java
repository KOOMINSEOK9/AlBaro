package hello.springmvc.web;

import hello.springmvc.domain.User;
import hello.springmvc.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

//    private final UserService userService;
//
//    @PostMapping("/joinForm")
//    public String joinUser(User joinUser){
//        System.out.println("aaa");
//
//        userService.joinUser(joinUser);
//        return "redirect:/home";
//    }

}
