package com.ferreyra.notesapp.notes.service;


import com.ferreyra.notesapp.notes.dto.NoteRequest;
import com.ferreyra.notesapp.notes.dto.NoteResponse;
import com.ferreyra.notesapp.notes.enitiy.Note;
import com.ferreyra.notesapp.notes.repository.NoteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {
    private final NoteRepository noteRepository;

    @Transactional
    public NoteResponse createNote(NoteRequest request, Long userId) {
        Note note = new Note();
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setUserId(userId);
        return convertToResponse(noteRepository.save(note));
    }
    @Transactional
    public NoteResponse archiveNote(Long id, Long userId) {
        Note note = getNoteAndCheckOwnership(id, userId);
        note.setArchived(true);
        return convertToResponse(noteRepository.save(note));
    }

    @Transactional
    public NoteResponse unarchiveNote(Long id, Long userId) {
        Note note = getNoteAndCheckOwnership(id, userId);
        note.setArchived(false);
        return convertToResponse(noteRepository.save(note));
    }

    public List<NoteResponse> getNotesByArchivedStatus(Long userId, boolean archived) {
        return noteRepository.findByUserIdAndArchivedOrderByUpdatedAtDesc(userId, archived)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<NoteResponse> getUserNotes(Long userId) {
        return noteRepository.findByUserIdOrderByUpdatedAtDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public NoteResponse getNoteById(Long id, Long userId) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to note");
        }
        return convertToResponse(note);
    }

    @Transactional
    public NoteResponse updateNote(Long id, NoteRequest request, Long userId) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to note");
        }

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        return convertToResponse(noteRepository.save(note));
    }

    @Transactional
    public void deleteNote(Long id, Long userId) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to note");
        }
        noteRepository.delete(note);
    }

    private Note getNoteAndCheckOwnership(Long id, Long userId) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

        if (!note.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to access this note");
        }
        return note;
    }

    private NoteResponse convertToResponse(Note note) {
        NoteResponse response = new NoteResponse();
        response.setId(note.getId());
        response.setTitle(note.getTitle());
        response.setContent(note.getContent());
        response.setCreatedAt(note.getCreatedAt());
        response.setUpdatedAt(note.getUpdatedAt());
        return response;
    }

}
