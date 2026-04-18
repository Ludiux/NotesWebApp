package com.ferreyra.notesapp.auth.service;

import com.ferreyra.notesapp.auth.entity.User;
import com.ferreyra.notesapp.auth.repository.UserRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public @NonNull UserDetails loadUserByUsername(@NonNull String identifier) {
        String normalizedIdentifier = normalizeIdentifier(identifier);
        User user = userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase(
                        normalizedIdentifier,
                        normalizedIdentifier
                )
                .orElseThrow(() -> new UsernameNotFoundException("User not found with identifier: " + normalizedIdentifier));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.emptyList()
        );
    }

    private String normalizeIdentifier(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            throw new UsernameNotFoundException("Identifier must not be blank");
        }

        return identifier.trim().toLowerCase();
    }
}
