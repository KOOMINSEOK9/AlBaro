package hello.springmvc.service;

import hello.springmvc.domain.User;
import hello.springmvc.domain.UserRepository;
import hello.springmvc.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RequiredArgsConstructor
@Service
public class UserService {

//    private final UserRepository userRepository;
//    private final BCryptPasswordEncoder passwordEncoder;
//
//    public User joinUser(User loginUser){
//        User user = User.builder()
//                .id(loginUser.getId())
//                .password(passwordEncoder.encode(loginUser.getPassword()))
//                .name(loginUser.getName())
//                .build();
//        return userRepository.save(user);
//    }


}
