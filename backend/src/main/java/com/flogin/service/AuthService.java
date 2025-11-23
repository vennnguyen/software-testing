package com.flogin.service;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;

public interface AuthService {
    LoginResponse authenticate(LoginRequest request);
}
