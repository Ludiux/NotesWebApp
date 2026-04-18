package com.ferreyra.notesapp.auth.service;

import com.ferreyra.notesapp.auth.dto.AuthRequest;
import com.ferreyra.notesapp.auth.dto.AuthResponse;
import com.ferreyra.notesapp.auth.dto.RegisterRequest;
import com.ferreyra.notesapp.auth.entity.User;
import com.ferreyra.notesapp.auth.repository.UserRepository;
import com.ferreyra.notesapp.auth.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            CustomUserDetailsService userDetailsService,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        String name = normalizeRequiredField(request.name(), "Name");
        String username = normalizeUsername(request.username());
        String email = normalizeEmail(request.email());
        String password = normalizeRequiredField(request.password(), "Password");

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new ResponseStatusException(BAD_REQUEST, "Username is already in use");
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(BAD_REQUEST, "Email is already in use");
        }

        User user = new User();
        user.setName(name);
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        User savedUser = userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        return buildAuthResponse(savedUser, jwtService.generateToken(userDetails));
    }

    public AuthResponse login(AuthRequest request) {
        String identifier = normalizeIdentifier(request.identifier());
        String password = normalizeRequiredField(request.password(), "Password");

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(identifier, password));
        } catch (BadCredentialsException exception) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid username/email or password");
        }

        User user = userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase(identifier, identifier)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "Invalid username/email or password"));
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());

        return buildAuthResponse(user, jwtService.generateToken(userDetails));
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return new AuthResponse(token, "Bearer", user.getId(), user.getName(), user.getUsername(), user.getEmail());
    }

    private String normalizeEmail(String email) {
        String normalizedEmail = normalizeRequiredField(email, "Email").trim().toLowerCase();
        if (!normalizedEmail.contains("@")) {
            throw new ResponseStatusException(BAD_REQUEST, "Email is invalid");
        }
        return normalizedEmail;
    }

    private String normalizeUsername(String username) {
        String normalizedUsername = normalizeRequiredField(username, "Username").trim().toLowerCase();
        if (normalizedUsername.contains("@")) {
            throw new ResponseStatusException(BAD_REQUEST, "Username cannot contain @");
        }
        return normalizedUsername;
    }

    private String normalizeIdentifier(String identifier) {
        String normalizedIdentifier = normalizeRequiredField(identifier, "Identifier").trim().toLowerCase();
        if (normalizedIdentifier.contains("@")) {
            return normalizeEmail(normalizedIdentifier);
        }
        return normalizeUsername(normalizedIdentifier);
    }

    private String normalizeRequiredField(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, fieldName + " is required");
        }
        return value.trim();
    }
}
