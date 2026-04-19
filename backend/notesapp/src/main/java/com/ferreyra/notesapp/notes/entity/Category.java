package com.ferreyra.notesapp.notes.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToMany(mappedBy = "categories")
    private Set<Note> notes = new HashSet<>();

    // Constructor for easy creation
    public Category(String name, Long userId) {
        this.name = name;
        this.userId = userId;
    }
}