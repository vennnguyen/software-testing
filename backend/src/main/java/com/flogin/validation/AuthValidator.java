package com.flogin.validation;

import com.flogin.dto.LoginRequest;
import org.springframework.stereotype.Component;

@Component
public class AuthValidator {

    public String validate(LoginRequest request) {
        if (request == null) {
            return "Request không được null";
        }
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            return "Thiếu username";
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return "Thiếu password";
        }
        return null; 
    }
}
