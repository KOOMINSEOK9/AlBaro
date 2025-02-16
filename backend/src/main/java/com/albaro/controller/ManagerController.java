package com.albaro.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@ResponseBody
public class ManagerController {

    @GetMapping("/manager")
    public String managerP(){
        return "Manager controller";
    }

}