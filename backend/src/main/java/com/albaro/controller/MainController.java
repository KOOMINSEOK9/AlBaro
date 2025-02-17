package com.albaro.controller;

import com.albaro.service.StoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@Controller
@ResponseBody
public class MainController {

    @Autowired
    private StoreService storeService;

    @GetMapping("/")
    public String mainp(){

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iter = authorities.iterator();
        GrantedAuthority auth = iter.next();
        String role = auth.getAuthority();

        return "Main controller"+ username + role;
    }

    @GetMapping("/api/getStoreInfo/{storeId}")
    public ResponseEntity<Map<String, String>> getStoreInfo(@PathVariable Integer storeId) {
        return storeService.getStoreById(storeId)
                .map(store -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("storeName", store.getStoreName());
                    response.put("franchiseName", store.getFranchiseName());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }
}