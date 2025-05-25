package com.empoderat.service;

import com.empoderat.dto.course.CourseResponse;
import com.empoderat.model.mysql.Category;
import com.empoderat.model.mysql.Course;
import com.empoderat.repository.mysql.CategoryRepository;
import com.empoderat.repository.mysql.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
     * Obtiene todos los cursos de forma paginada
     */
    @Transactional(readOnly = true)
    public Page<CourseResponse> getAllCourses(Pageable pageable) {
        return courseRepository.findAll(pageable)
                .map(CourseResponse::fromEntity);
    }

    /**
     * Busca cursos por categoría
     */
    @Transactional(readOnly = true)
    public List<Course> getCoursesByCategory(Long categoryId) {
        Optional<Category> category = categoryRepository.findById(categoryId);
        return category.map(courseRepository::findByCategory).orElse(Collections.emptyList());
    }

    /**
     * Busca cursos por nombre (parcial)
     */
    @Transactional(readOnly = true)
    public Page<CourseResponse> searchCourses(String query, Pageable pageable) {
        return courseRepository.findByNameContainingIgnoreCase(query, pageable)
                .map(CourseResponse::fromEntity);
    }

    /**
     * Obtiene todos los cursos sin paginación
     */
    @Transactional(readOnly = true)
    public List<CourseResponse> getAllCoursesWithoutPagination() {
        return courseRepository.findAll().stream()
                .map(CourseResponse::fromEntity)
                .collect(Collectors.toList());
    }
}