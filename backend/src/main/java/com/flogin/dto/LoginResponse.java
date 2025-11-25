package com.flogin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private final boolean success;
    private final String message;
    private final String token;
}
