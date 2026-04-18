package com.ferreyra.notesapp.auth.dto;

public record AuthResponse(String accessToken, String tokenType, Long userId, String name, String username, String email) {
}
