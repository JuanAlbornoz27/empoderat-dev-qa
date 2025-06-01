package com.empoderat.service;

import com.empoderat.dto.course.CourseRequest; 
import com.empoderat.dto.course.CourseResponse;
import com.empoderat.model.mysql.Category;
import com.empoderat.model.mysql.Course;
import com.empoderat.repository.mysql.CategoryRepository;
import com.empoderat.repository.mysql.CourseRepository;

import jakarta.persistence.EntityNotFoundException; 
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile; 

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID; 
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
     * Obtiene un curso por su ID.
     */
    @Transactional(readOnly = true)
    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado con ID: " + id));
        return CourseResponse.fromEntity(course);
    }

    /**
     * Busca cursos por categoría sin paginación
     */
    @Transactional(readOnly = true)
    public List<CourseResponse> getCoursesByCategoryWithoutPagination(Long categoryId) {
        Optional<Category> category = categoryRepository.findById(categoryId); //
        if (category.isPresent()) {
            return courseRepository.findByCategory(category.get()).stream() //
                    .map(CourseResponse::fromEntity) //
                    .collect(Collectors.toList()); //
        }
        return Collections.emptyList(); //
    }

    /**
     * Busca cursos por nombre (parcial) sin paginación
     */
    @Transactional(readOnly = true)
    public List<CourseResponse> searchCoursesWithoutPagination(String query) {
        return courseRepository.findByNameContainingIgnoreCase(query).stream() //
                .map(CourseResponse::fromEntity) //
                .collect(Collectors.toList()); //
    }

    /**
     * Crea un nuevo curso.
     */
    @Transactional
    public CourseResponse createCourse(CourseRequest courseRequest) {
        Category category = categoryRepository.findById(courseRequest.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + courseRequest.getCategoryId()));

        Course course = Course.builder()
                .name(courseRequest.getName())
                .description(courseRequest.getDescription())
                .category(category)
                .status(Course.Status.valueOf(courseRequest.getStatus().toUpperCase())) 
                .estimatedDuration(courseRequest.getEstimatedDuration())
                .imageUrl(courseRequest.getImageUrl())
                .enrolledCount(0) 
                .build();

        Course savedCourse = courseRepository.save(course);
        return CourseResponse.fromEntity(savedCourse);
    }

    /**
     * Actualiza un curso existente.
     */
    @Transactional
    public CourseResponse updateCourse(Long id, CourseRequest courseRequest) {
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado con ID: " + id));

        Category category = categoryRepository.findById(courseRequest.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + courseRequest.getCategoryId()));

        existingCourse.setName(courseRequest.getName());
        existingCourse.setDescription(courseRequest.getDescription());
        existingCourse.setCategory(category);
        existingCourse.setStatus(Course.Status.valueOf(courseRequest.getStatus().toUpperCase())); 
        existingCourse.setEstimatedDuration(courseRequest.getEstimatedDuration());
        existingCourse.setImageUrl(courseRequest.getImageUrl()); // Actualiza la URL de la imagen

        Course updatedCourse = courseRepository.save(existingCourse);
        return CourseResponse.fromEntity(updatedCourse);
    }

    /**
     * Elimina un curso por su ID.
     */
    @Transactional
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new EntityNotFoundException("Curso no encontrado con ID: " + id);
        }
        // Considera la lógica de qué sucede si el curso tiene módulos
        courseRepository.deleteById(id);
    }

    /**
     * Actualiza solo el estado de un curso.
     */
    @Transactional
    public CourseResponse updateCourseStatus(Long id, Course.Status status) { 
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado con ID: " + id));

        existingCourse.setStatus(status);
        Course updatedCourse = courseRepository.save(existingCourse);
        return CourseResponse.fromEntity(updatedCourse);
    }
}