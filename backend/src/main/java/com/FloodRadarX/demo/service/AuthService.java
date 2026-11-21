package com.FloodRadarX.demo.service;

import com.FloodRadarX.demo.dto.*;
import com.FloodRadarX.demo.entity.Role;
import com.FloodRadarX.demo.entity.User;
import com.FloodRadarX.demo.exception.BadRequestException;
import com.FloodRadarX.demo.exception.ResourceNotFoundException;
import com.FloodRadarX.demo.exception.UnauthorizedException;
import com.FloodRadarX.demo.repository.UserRepository;
import com.FloodRadarX.demo.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, 
                       PasswordEncoder passwordEncoder, 
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validation of unique email
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("An account with this email address already exists");
        }

        // Validation of unique phone number
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber().trim())) {
            throw new BadRequestException("An account with this phone number already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPhoneNumber(request.getPhoneNumber().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_USER);
        user.setEnabled(true);
        user.setPreferredDistrict(request.getPreferredDistrict());
        user.setPreferredState(request.getPreferredState());

        User savedUser = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole().name(), savedUser.getId());
        return new AuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier().trim();
        User user = userRepository.findByEmailOrPhoneNumber(identifier.toLowerCase(), identifier)
                .orElseThrow(() -> new UnauthorizedException("Invalid email/phone or password"));

        if (!user.isEnabled()) {
            throw new UnauthorizedException("Your account is currently disabled. Please contact administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email/phone or password");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name());
    }

    public UserProfileResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return new UserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole().name(),
                user.isEnabled(),
                user.getPreferredDistrict(),
                user.getPreferredState()
        );
    }
}
