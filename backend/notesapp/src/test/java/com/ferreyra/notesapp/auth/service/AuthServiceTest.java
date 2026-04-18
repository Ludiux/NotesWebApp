package com.ferreyra.notesapp.auth.service;

import com.ferreyra.notesapp.auth.dto.AuthRequest;
import com.ferreyra.notesapp.auth.dto.AuthResponse;
import com.ferreyra.notesapp.auth.dto.RegisterRequest;
import com.ferreyra.notesapp.auth.repository.UserRepository;
import com.ferreyra.notesapp.auth.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerCreatesUserWithEncodedPasswordAndReturnsToken() {
        RegisterRequest request = new RegisterRequest("Lucia", "  LuciaUser ", "  Lucia@Example.com ", "secret123");
        com.ferreyra.notesapp.auth.entity.User savedUser = new com.ferreyra.notesapp.auth.entity.User();
        savedUser.setId(7L);
        savedUser.setName("Lucia");
        savedUser.setUsername("luciauser");
        savedUser.setEmail("lucia@example.com");
        savedUser.setPassword("encoded-secret");
        User userDetails = new User("luciauser", "encoded-secret", java.util.Collections.emptyList());

        when(userRepository.existsByUsernameIgnoreCase("luciauser")).thenReturn(false);
        when(userRepository.existsByEmailIgnoreCase("lucia@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded-secret");
        when(userRepository.save(any(com.ferreyra.notesapp.auth.entity.User.class))).thenReturn(savedUser);
        when(userDetailsService.loadUserByUsername("luciauser")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        ArgumentCaptor<com.ferreyra.notesapp.auth.entity.User> userCaptor =
                ArgumentCaptor.forClass(com.ferreyra.notesapp.auth.entity.User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("Lucia", userCaptor.getValue().getName());
        assertEquals("luciauser", userCaptor.getValue().getUsername());
        assertEquals("lucia@example.com", userCaptor.getValue().getEmail());
        assertEquals("encoded-secret", userCaptor.getValue().getPassword());
        assertEquals("jwt-token", response.accessToken());
        assertEquals("Bearer", response.tokenType());
        assertEquals(7L, response.userId());
        assertEquals("Lucia", response.name());
        assertEquals("luciauser", response.username());
        assertEquals("lucia@example.com", response.email());
    }

    @Test
    void registerRejectsDuplicateUsername() {
        when(userRepository.existsByUsernameIgnoreCase("luciauser")).thenReturn(true);

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.register(new RegisterRequest("Lucia", "luciauser", "lucia@example.com", "secret123"))
        );

        assertEquals("400 BAD_REQUEST \"Username is already in use\"", exception.getMessage());
    }

    @Test
    void loginAuthenticatesWithEmailAndReturnsToken() {
        AuthRequest request = new AuthRequest(" Lucia@Example.com ", "secret123");
        com.ferreyra.notesapp.auth.entity.User appUser = new com.ferreyra.notesapp.auth.entity.User();
        appUser.setId(9L);
        appUser.setName("Lucia");
        appUser.setUsername("luciauser");
        appUser.setEmail("lucia@example.com");
        appUser.setPassword("encoded-secret");
        User userDetails = new User("luciauser", "encoded-secret", java.util.Collections.emptyList());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken("lucia@example.com", "secret123"));
        when(userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase("lucia@example.com", "lucia@example.com"))
                .thenReturn(Optional.of(appUser));
        when(userDetailsService.loadUserByUsername("luciauser")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertEquals("jwt-token", response.accessToken());
        assertEquals("luciauser", response.username());
        assertEquals("lucia@example.com", response.email());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void loginAuthenticatesWithUsernameAndReturnsToken() {
        AuthRequest request = new AuthRequest(" LuciaUser ", "secret123");
        com.ferreyra.notesapp.auth.entity.User appUser = new com.ferreyra.notesapp.auth.entity.User();
        appUser.setId(9L);
        appUser.setName("Lucia");
        appUser.setUsername("luciauser");
        appUser.setEmail("lucia@example.com");
        appUser.setPassword("encoded-secret");
        User userDetails = new User("luciauser", "encoded-secret", java.util.Collections.emptyList());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken("luciauser", "secret123"));
        when(userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase("luciauser", "luciauser"))
                .thenReturn(Optional.of(appUser));
        when(userDetailsService.loadUserByUsername("luciauser")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertEquals("jwt-token", response.accessToken());
        assertEquals("luciauser", response.username());
        assertEquals("lucia@example.com", response.email());
    }

    @Test
    void registerRejectsInvalidUsername() {
        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.register(new RegisterRequest("Lucia", "bad@name", "lucia@example.com", "secret123"))
        );

        assertEquals("400 BAD_REQUEST \"Username cannot contain @\"", exception.getMessage());
    }
}
