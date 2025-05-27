package com.empoderat.service;

import com.empoderat.dto.course.CourseResponse;
import com.empoderat.model.mysql.Category;
import com.empoderat.model.mysql.Course;
import com.empoderat.repository.mysql.CategoryRepository;
import com.empoderat.repository.mysql.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Obtiene todos los cursos sin paginación
     */
    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCoursesWithoutPagination() {
        return courseRepository.findAll().stream()
                .map(CourseResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Busca cursos por categoría sin paginación
     */
    @Transactional(readOnly = true)
    public List<CourseResponse> getCoursesByCategoryWithoutPagination(Long categoryId) {
        Optional<Category> category = categoryRepository.findById(categoryId);
        if (category.isPresent()) {
            return courseRepository.findByCategory(category.get()).stream()
                    .map(CourseResponse::fromEntity)
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    /**
     * Busca cursos por nombre (parcial) sin paginación
     */
    @Transactional(readOnly = true)
    public List<CourseResponse> searchCoursesWithoutPagination(String query) {
        return courseRepository.findByNameContainingIgnoreCase(query).stream()
                .map(CourseResponse::fromEntity)
                .collect(Collectors.toList());
    }
}