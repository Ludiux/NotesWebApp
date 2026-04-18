package com.ferreyra.notesapp.auth.service;

import com.ferreyra.notesapp.auth.entity.User;
import com.ferreyra.notesapp.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void loadUserByUsernameReturnsUserDetailsForTrimmedEmail() {
        User user = new User();
        user.setUsername("lucia");
        user.setEmail("user@example.com");
        user.setPassword("secret");
        when(userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase("user@example.com", "user@example.com"))
                .thenReturn(Optional.of(user));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("  User@Example.com  ");

        assertEquals("lucia", userDetails.getUsername());
        assertEquals("secret", userDetails.getPassword());
        verify(userRepository).findByEmailIgnoreCaseOrUsernameIgnoreCase("user@example.com", "user@example.com");
    }

    @Test
    void loadUserByUsernameRejectsBlankEmail() {
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> customUserDetailsService.loadUserByUsername("   ")
        );

        assertEquals("Identifier must not be blank", exception.getMessage());
        verifyNoInteractions(userRepository);
    }

    @Test
    void loadUserByUsernameThrowsWhenUserDoesNotExist() {
        when(userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase("missing@example.com", "missing@example.com"))
                .thenReturn(Optional.empty());

        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> customUserDetailsService.loadUserByUsername("missing@example.com")
        );

        assertEquals("User not found with identifier: missing@example.com", exception.getMessage());
        verify(userRepository).findByEmailIgnoreCaseOrUsernameIgnoreCase("missing@example.com", "missing@example.com");
    }

    @Test
    void loadUserByUsernameReturnsUserDetailsForUsername() {
        User user = new User();
        user.setUsername("lucia");
        user.setEmail("lucia@example.com");
        user.setPassword("secret");
        when(userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase("lucia", "lucia"))
                .thenReturn(Optional.of(user));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("Lucia");

        assertEquals("lucia", userDetails.getUsername());
        assertEquals("secret", userDetails.getPassword());
        verify(userRepository).findByEmailIgnoreCaseOrUsernameIgnoreCase("lucia", "lucia");
    }
}
