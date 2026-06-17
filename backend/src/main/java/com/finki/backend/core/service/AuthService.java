package com.finki.backend.core.service;

import com.finki.backend.core.domain.User;
import com.finki.backend.core.exception.BadRequestException;
import com.finki.backend.core.exception.UnauthorizedException;
import com.finki.backend.core.repository.UserRepository;
import com.finki.backend.core.security.JwtService;
import com.finki.backend.web.request.LoginRequest;
import com.finki.backend.web.request.RegisterRequest;
import com.finki.backend.web.response.AuthResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new BadRequestException("Username already taken");
        }

        String encodedPassword = passwordEncoder.encode(request.password());
        User user = new User(request.username(), encodedPassword, request.name());
        userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.getUsername());

        log.info("Registered new user: {}", request.username());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(86400L)
                .userId(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        String token = jwtService.generateToken(user.getId(), user.getUsername());

        log.info("User logged in: {}", request.username());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(86400L)
                .userId(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .build();
    }
}
