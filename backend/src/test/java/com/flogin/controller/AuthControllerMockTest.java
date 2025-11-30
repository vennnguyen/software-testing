package com.flogin.controller;

import com.flogin.dto.LoginRequest;
import com.flogin.dto.LoginResponse;
import com.flogin.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerMockTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Test
    @DisplayName("Mock: Controller login thành công với mocked service")
    void testLoginWithMockedService() throws Exception {

        LoginResponse mockResponse = new LoginResponse(
                true,
                "Success",
                "mock-token"
        );

        when(authService.authenticate(any()))
                .thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(" {\" username \":\" test \" ,\" password \":\" Pass123 \"}"))

                .andExpect(status().isOk());

        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }

    @Test
    @DisplayName("Mock: Controller login thất bại")
    void testLoginFailureWithMockedService() throws Exception {
        LoginResponse mockResponse = new LoginResponse(false, "Invalid credentials", null);

        when(authService.authenticate(any(LoginRequest.class)))
                .thenReturn(mockResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(" {\" username \":\" test \" ,\" password \":\" Pass123 \"}"))

                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));

        verify(authService, times(1)).authenticate(any(LoginRequest.class));
    }
}