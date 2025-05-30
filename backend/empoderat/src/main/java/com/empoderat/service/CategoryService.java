package com.empoderat.service;

import com.empoderat.dto.category.CategoryResponse;
import com.empoderat.model.mysql.Category;
import com.empoderat.repository.mysql.CategoryRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public CategoryResponse createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + category.getName());
        }

        Category savedCategory = categoryRepository.save(category);
        return CategoryResponse.fromEntity(savedCategory);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new EntityNotFoundException("No se encontró la categoría con ID: " + id);
        }

        // Verificar si hay cursos asociados a esta categoría
        if (!categoryRepository.findById(id).get().getCourses().isEmpty()) {
            throw new IllegalStateException("No se puede eliminar la categoría porque tiene cursos asociados");
        }

        categoryRepository.deleteById(id);
    }
}