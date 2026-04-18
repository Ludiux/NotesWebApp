package com.ferreyra.notesapp.notes.dto;


import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class NoteRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String content;
}
