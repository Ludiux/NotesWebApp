package com.ferreyra.notesapp.notes.controller;

import com.ferreyra.notesapp.auth.entity.User;
import com.ferreyra.notesapp.auth.repository.UserRepository;
import com.ferreyra.notesapp.notes.dto.CategoryRequest;
import com.ferreyra.notesapp.notes.dto.CategoryResponse;
import com.ferreyra.notesapp.notes.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        Long userId = getCurrentUserId();
        CategoryResponse response = categoryService.createCategory(request, userId);
        return ResponseEntity.created(URI.create("/api/categories/" + response.getId()))
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getUserCategories() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(categoryService.getUserCategories(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        categoryService.deleteCategory(id, userId);
        return ResponseEntity.noContent().build();
    }

    private Long getCurrentUserId() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getName)
                .filter(StringUtils::hasText)
                .flatMap(userRepository::findByUsernameIgnoreCase)
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("Could not get authenticated user ID"));
    }
}