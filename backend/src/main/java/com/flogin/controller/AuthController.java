package com.flogin.controller;

import com.flogin.dto.LoginRequest;
import com.flogin.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public Object login(@RequestBody LoginRequest req) {

        return authService.authenticate(req);
    }
}
