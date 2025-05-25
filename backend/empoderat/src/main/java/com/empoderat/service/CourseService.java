package com.empoderat.service;

import com.empoderat.dto.course.CourseResponse;
import com.empoderat.model.mysql.Course;
import com.empoderat.repository.mysql.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

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
    public List<Course> getCoursesByCategory(Course.Category category) {
        return courseRepository.findByCategory(category);
    }

    /**
     * Busca cursos por título (parcial)
     */
    @Transactional(readOnly = true)
    public Page<CourseResponse> searchCourses(String query, Pageable pageable) {
        return courseRepository.findByTitleContainingIgnoreCase(query, pageable)
                .map(CourseResponse::fromEntity);
    }
}