package com.albaro.service;

import com.albaro.dto.CustomUserDetails;
import com.albaro.entity.User;
import com.albaro.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }


    //username의 역할을 accountId가 대신해줌
    @Override
    public UserDetails loadUserByUsername(String accountId) throws UsernameNotFoundException {

        System.out.println("CustomUserDetailService: "+ accountId);
        Optional<User> userData = userRepository.findByAccountId(Integer.parseInt(accountId));

        if(userData.isPresent()) {
            return new CustomUserDetails(userData.get());
        }

        throw new UsernameNotFoundException("User not found with accountId: " + accountId);
    }

}