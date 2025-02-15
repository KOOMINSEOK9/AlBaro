//package com.albaro.dto;
//
//import com.albaro.entity.User;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.util.ArrayList;
//import java.util.Collection;
//
////spring security에서 인증된 사용자의 정보 반환하는 역할
//public class CustomUserDetails implements UserDetails {
//
//    private User userEntity;
//
//    public CustomUserDetails(User userEntity){
//        this.userEntity = userEntity;
//    }
//
//
//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//
//        Collection<GrantedAuthority> collection = new ArrayList<>();
//
//        collection.add(new GrantedAuthority() {
//
//            @Override
//            public String getAuthority() {
//                //사용자에게 부여된 역할(권한)을 반환
//                return userEntity.getRole();
//            }
//        });
//
//        return collection;
//        // GrantedAuthority 객체를 담고 있는 collection 반환
//        // -> 사용자의 권한 정보를 spring security에 제공
//    }
//
//    @Override
//    public String getPassword() {
//        return userEntity.getPassword();
//    }
//
//    @Override
//    public String getUsername() {
//        return String.valueOf(userEntity.getAccountId());
//        //accountId 반환
//    }
//
//    @Override
//    public boolean isAccountNonExpired() {
//        return true;
//    }
//
//    @Override
//    public boolean isAccountNonLocked() {
//        return true;
//    }
//
//    @Override
//    public boolean isCredentialsNonExpired() {
//        return true;
//    }
//
//    @Override
//    public boolean isEnabled() {
//        return true;
//    }
//}
//
