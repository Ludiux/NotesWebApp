package com.ferreyra.notesapp.auth.dto;

public record RegisterRequest(String name, String username, String email, String password) {
}
