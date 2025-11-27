package com.flogin.validation;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.flogin.dto.LoginRequest;

public class AuthValidatorTest {

    private AuthValidator validator;

    @BeforeEach
    void setUp() {
        validator = new AuthValidator();
    }

    @Test
    void testMissingUsername() {
        LoginRequest req = new LoginRequest(null, "123");
        assertEquals("Thiếu username", validator.validate(req));
    }

    @Test
    void testMissingPassword() {
        LoginRequest req = new LoginRequest("user", "");
        assertEquals("Thiếu password", validator.validate(req));
    }

    @Test
    void testValid() {
        LoginRequest req = new LoginRequest("user", "123");
        assertNull(validator.validate(req));
    }
}

