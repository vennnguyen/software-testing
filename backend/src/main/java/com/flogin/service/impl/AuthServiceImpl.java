package com.flogin.service.impl;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import com.flogin.service.JwtService;
import com.flogin.validation.AuthValidator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtService jwtUtil;

    @Override
    public LoginResponse authenticate(LoginRequest request) {
        String validationError = new AuthValidator().validate(request);
        if (validationError != null) {
            return new LoginResponse(false, validationError, null);
        }

        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (Exception e) {
            return new LoginResponse(false, "Sai thông tin đăng nhập", null);
        }

        String token = jwtUtil.generateToken(request.getUsername());
        return new LoginResponse(true, "Đăng nhập thành công", token);
    }
}
