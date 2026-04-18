package com.ferreyra.notesapp.notes.service;


import com.ferreyra.notesapp.notes.dto.CategoryRequest;
import com.ferreyra.notesapp.notes.dto.CategoryResponse;
import com.ferreyra.notesapp.notes.entity.Category;
import com.ferreyra.notesapp.notes.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request, Long userId) {
        Category category = new Category(request.getName(), userId);
        return convertToResponse(categoryRepository.save(category));
    }

    public List<CategoryResponse> getUserCategories(Long userId) {
        return categoryRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCategory(Long id, Long userId) {
        Category category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        categoryRepository.delete(category);
    }

    private CategoryResponse convertToResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        return response;
    }
}
