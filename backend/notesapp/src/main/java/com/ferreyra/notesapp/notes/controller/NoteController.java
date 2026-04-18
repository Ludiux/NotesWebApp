package com.ferreyra.notesapp.notes.controller;


import com.ferreyra.notesapp.auth.entity.User;
import com.ferreyra.notesapp.auth.repository.UserRepository;
import com.ferreyra.notesapp.notes.dto.NoteRequest;
import com.ferreyra.notesapp.notes.dto.NoteResponse;
import com.ferreyra.notesapp.notes.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {
    private final NoteService noteService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<NoteResponse> createNote(@Valid @RequestBody NoteRequest request) {
        Long userId = getCurrentUserId();
        NoteResponse response = noteService.createNote(request, userId);
        return ResponseEntity.created(URI.create("/api/notes/" + response.getId()))
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<NoteResponse>> getAllNotes() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(noteService.getUserNotes(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteResponse> getNoteById(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(noteService.getNoteById(id, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteResponse> updateNote(
            @PathVariable Long id,
            @Valid @RequestBody NoteRequest request) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(noteService.updateNote(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        noteService.deleteNote(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<NoteResponse> archiveNote(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noteService.archiveNote(id, user.getId()));
    }

    @PatchMapping("/{id}/unarchive")
    public ResponseEntity<NoteResponse> unarchiveNote(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noteService.unarchiveNote(id, user.getId()));
    }
    @GetMapping("/active")
    public ResponseEntity<List<NoteResponse>> getActiveNotes(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noteService.getNotesByArchivedStatus(user.getId(), false));
    }

    @GetMapping("/archived")
    public ResponseEntity<List<NoteResponse>> getArchivedNotes(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noteService.getNotesByArchivedStatus(user.getId(), true));
    }

    // Get userId with JWT token
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
