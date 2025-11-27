package com.flogin.service.impl;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.JwtService;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Câu 2.1.2: AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private AuthenticationManager authManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthServiceImpl authService;

    // 1. Login thành công
    @Test
    @DisplayName("TC1: Login thành công và tạo JWT Token")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("testuser", "Test123");

        when(jwtService.generateToken("testuser")).thenReturn("mock-token");

        LoginResponse response = authService.authenticate(request);

        assertTrue(response.isSuccess());
        assertEquals("Đăng nhập thành công", response.getMessage());
        assertEquals("mock-token", response.getToken());

        verify(authManager, times(1))
                .authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    // 2. Username không tồn tại
    @Test
    @DisplayName("TC2: Login thất bại do username không tồn tại")
    void testLoginFailureUserNotFound() {
        LoginRequest request = new LoginRequest("nouser", "123456");

        doThrow(new UsernameNotFoundException("not found"))
                .when(authManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Sai thông tin đăng nhập", response.getMessage());
        assertNull(response.getToken());

        verify(jwtService, never()).generateToken(any());
    }

    // 3. Password sai
    @Test
    @DisplayName("TC3: Login thất bại do password sai")
    void testWrongPassword() {
        LoginRequest request = new LoginRequest("abc", "wrongpass");

        doThrow(new BadCredentialsException("bad credentials"))
                .when(authManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertNull(response.getToken());
        assertEquals("Sai thông tin đăng nhập", response.getMessage());
    }

    // 4. Validation errors
    @Test
    @DisplayName("TC4: Validation lỗi - username null")
    void testValidationError() {
        LoginRequest request = new LoginRequest(null, "123");

        LoginResponse response = authService.authenticate(request);

        assertFalse(response.isSuccess());
        assertEquals("Thiếu username", response.getMessage());
        assertNull(response.getToken());

        verify(authManager, never()).authenticate(any());
    }
}
