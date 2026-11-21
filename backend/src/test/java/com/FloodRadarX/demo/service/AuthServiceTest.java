package com.FloodRadarX.demo.service;

import com.FloodRadarX.demo.dto.AuthResponse;
import com.FloodRadarX.demo.dto.LoginRequest;
import com.FloodRadarX.demo.dto.RegisterRequest;
import com.FloodRadarX.demo.entity.Role;
import com.FloodRadarX.demo.entity.User;
import com.FloodRadarX.demo.exception.BadRequestException;
import com.FloodRadarX.demo.exception.UnauthorizedException;
import com.FloodRadarX.demo.repository.UserRepository;
import com.FloodRadarX.demo.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, jwtTokenProvider);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest(
                "Test User", "test@floodradarx.in", "9999999999", "password123", "Ludhiana", "Punjab"
        );

        when(userRepository.existsByEmail("test@floodradarx.in")).thenReturn(false);
        when(userRepository.existsByPhoneNumber("9999999999")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        User savedUser = new User("Test User", "test@floodradarx.in", "9999999999", "encodedPassword", Role.ROLE_USER);
        savedUser.setId(1L);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtTokenProvider.generateToken(anyString(), anyString(), anyLong())).thenReturn("mockJwtToken");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertEquals("test@floodradarx.in", response.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testRegisterDuplicateEmailThrowsException() {
        RegisterRequest request = new RegisterRequest(
                "Test User", "duplicate@floodradarx.in", "9999999999", "password123", "Ludhiana", "Punjab"
        );

        when(userRepository.existsByEmail("duplicate@floodradarx.in")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("test@floodradarx.in", "password123");

        User user = new User("Test User", "test@floodradarx.in", "9999999999", "encodedPassword", Role.ROLE_USER);
        user.setId(1L);
        user.setEnabled(true);

        when(userRepository.findByEmailOrPhoneNumber("test@floodradarx.in", "test@floodradarx.in"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(jwtTokenProvider.generateToken(anyString(), anyString(), anyLong())).thenReturn("mockJwtToken");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertEquals(1L, response.getUserId());
    }

    @Test
    void testLoginInvalidPasswordThrowsUnauthorized() {
        LoginRequest request = new LoginRequest("test@floodradarx.in", "wrongPassword");

        User user = new User("Test User", "test@floodradarx.in", "9999999999", "encodedPassword", Role.ROLE_USER);
        user.setId(1L);

        when(userRepository.findByEmailOrPhoneNumber("test@floodradarx.in", "test@floodradarx.in"))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }
}
