package com.ferreyra.notesapp.notes.repository;


import com.ferreyra.notesapp.notes.enitiy.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserIdOrderByUpdatedAtDesc(Long userId);
    List<Note> findByUserIdAndTitleContainingIgnoreCase(Long userId, String title);
}
