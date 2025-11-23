package com.flogin.service.impl;

import com.flogin.dto.UserDto;
import com.flogin.entity.User;
import com.flogin.repository.UserRepository;
import com.flogin.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

        private final UserRepository repository;

        public UserServiceImpl(UserRepository repository) {
                this.repository = repository;
        }

        @Override
        public UserDto createUser(UserDto dto) {
                User user = User.builder()
                                .username(dto.getUsername())
                                .password(dto.getPassword())
                                .build();
                User saved = repository.save(user);
                return UserDto.builder()
                                .id(saved.getId())
                                .username(saved.getUsername())
                                .password(saved.getPassword())
                                .build();
        }

        @Override
        public List<UserDto> getAll() {
                return repository.findAll().stream()
                                .map(u -> UserDto.builder()
                                                .id(u.getId())
                                                .username(u.getUsername())
                                                .password(u.getPassword())
                                                .build())
                                .collect(Collectors.toList());
        }

}
