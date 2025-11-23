package com.flogin.service;

import com.flogin.dto.UserDto;

import java.util.List;

public interface UserService {

    UserDto createUser(UserDto dto);

    List<UserDto> getAll();
}
