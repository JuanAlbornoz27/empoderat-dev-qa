package com.empoderat.service;

import com.empoderat.dto.course.CourseRequest;
import com.empoderat.dto.course.CourseResponse;
import com.empoderat.model.mysql.Category;
import com.empoderat.model.mysql.Course;
import com.empoderat.model.mysql.User;
import com.empoderat.repository.mysql.CategoryRepository;
import com.empoderat.repository.mysql.CourseRepository;
import com.empoderat.repository.mysql.ModuleRepository;
import com.empoderat.repository.mysql.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CourseService {

    private static final Logger log = LoggerFactory.getLogger(CourseService.class);

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ModuleRepository moduleRepository; 

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
                .orElseThrow(() -> new IllegalArgumentException(
                        "Categoría no encontrada con ID: " + courseRequest.getCategoryId()));

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
                .orElseThrow(() -> new IllegalArgumentException(
                        "Categoría no encontrada con ID: " + courseRequest.getCategoryId()));

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
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado con ID: " + id));

        // Verificar si el curso tiene módulos
        if (!course.getModules().isEmpty()) {
            // Primero eliminar los módulos asociados
            moduleRepository.deleteAll(course.getModules());
        }
        // Luego eliminar el curso
        courseRepository.delete(course);
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

    /**
     * Obtiene los cursos en los que un usuario está inscrito por email
     */
    @Transactional(readOnly = true)
    public List<CourseResponse> getEnrolledCoursesByEmail(String email) {
        log.info("Buscando cursos inscritos para el usuario con email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("Usuario no encontrado con email: {}", email);
                    return new EntityNotFoundException("Usuario no encontrado con email: " + email);
                });

        log.info("Usuario encontrado con ID: {}", user.getId());

        // Verificar si la colección de cursos inscritos no es null
        if (user.getEnrolledCourses() == null) {
            log.info("El usuario no tiene cursos inscritos (colección null)");
            return Collections.emptyList();
        }

        List<CourseResponse> enrolledCourses = user.getEnrolledCourses().stream()
                .map(CourseResponse::fromEntity)
                .collect(Collectors.toList());

        log.info("Encontrados {} cursos inscritos para el usuario", enrolledCourses.size());
        return enrolledCourses;
    }

    

    /**
     * Desinscribe a un usuario de un curso por correo electrónico.
     */
    @Transactional
    public void unenrollUserFromCourse(String email, Long courseId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado"));

        if (!user.getEnrolledCourses().contains(course)) {
            throw new IllegalStateException("El usuario no está inscrito en este curso");
        }

        user.getEnrolledCourses().remove(course);
        course.setEnrolledCount(course.getEnrolledCount() - 1);

        userRepository.save(user);
        courseRepository.save(course);
    }
}