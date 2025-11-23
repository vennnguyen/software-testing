package com.flogin.service;

public interface JwtService {
    String generateToken(String username);

    String extractUsername(String token);
}
