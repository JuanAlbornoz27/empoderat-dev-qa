package com.empoderat.service;

import com.empoderat.dto.course.CourseRequest; 
import com.empoderat.dto.course.CourseResponse;
import com.empoderat.dto.enrollment.EnrollmentResponse;
import com.empoderat.model.mysql.Category;
import com.empoderat.model.mysql.Course;
import com.empoderat.model.mysql.Enrollment;
import com.empoderat.model.mysql.User;
import com.empoderat.repository.mysql.CategoryRepository;
import com.empoderat.repository.mysql.CourseRepository;
import com.empoderat.repository.mysql.EnrollmentRepository;
import com.empoderat.repository.mysql.UserRepository;

import jakarta.persistence.EntityNotFoundException; 
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile; 

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID; 
import java.util.stream.Collectors;

@Service
@Slf4j
public class CourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final EventService eventService;

    @Autowired
    public CourseService(
            CourseRepository courseRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            @Lazy EventService eventService) {  // Añadir @Lazy aquí
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.eventService = eventService;
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
        existingCourse.setImageUrl(courseRequest.getImageUrl());

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

    /**
     * Cuenta el número total de inscripciones a cursos
     * @return Número total de inscripciones
     */
    public int countAllEnrollments() {
        return courseRepository.countTotalEnrollments();
    }

    /**
     * Cuenta el número de inscripciones nuevas desde una fecha determinada
     * @param since Fecha desde la que contar nuevas inscripciones
     * @return Número de inscripciones desde la fecha indicada
     */
    public int countNewEnrollmentsSince(LocalDateTime since) {
        return courseRepository.countEnrollmentsAfter(since);
    }

    /**
     * Calcula el promedio de inscripciones por curso
     * @return Promedio de inscripciones por curso
     */
    public double getAverageEnrollmentsPerCourse() {
        int totalCourses = (int) courseRepository.count();
        int totalEnrollments = countAllEnrollments();
        
        return totalCourses > 0 ? (double) totalEnrollments / totalCourses : 0;
    }

    /**
     * Obtiene la distribución de inscripciones por curso
     * @return Mapa con nombre de curso y número de inscripciones
     */
    public Map<String, Integer> getEnrollmentCountByCourse() {
        List<Object[]> results = courseRepository.countEnrollmentsGroupByCourse();
        Map<String, Integer> enrollmentsByCourse = new HashMap<>();
        
        for (Object[] result : results) {
            String courseName = (String) result[0];
            Integer count = ((Number) result[1]).intValue();
            enrollmentsByCourse.put(courseName, count);
        }
        
        return enrollmentsByCourse;
    }

    /**
     * Cuenta las inscripciones realizadas en un rango de fechas
     * @param start Fecha de inicio del rango
     * @param end Fecha de fin del rango
     * @return Número de inscripciones en el rango de fechas
     */
    public int countEnrollmentsBetween(LocalDateTime start, LocalDateTime end) {
        return courseRepository.countEnrollmentsBetween(start, end);
    }

    /**
     * Cuenta el número total de cursos completados
     * @return Número total de cursos completados
     */
    public int countCompletedCourses() {
        return courseRepository.countCompletedCourses();
    }

    /**
     * Calcula la tasa de compleción de cursos (porcentaje)
     * @return Porcentaje de cursos completados sobre el total de inscripciones
     */
    public double getCompletionRate() {
        int totalEnrollments = countAllEnrollments();
        int completedCourses = countCompletedCourses();
        
        return totalEnrollments > 0 ? (double) completedCourses * 100 / totalEnrollments : 0;
    }

    /**
     * Obtiene la distribución de cursos completados por categoría
     * @return Mapa con nombre de categoría y número de cursos completados
     */
    public Map<String, Integer> getCompletedCoursesByCategory() {
        List<Object[]> results = courseRepository.countCompletedCoursesGroupByCategory();
        Map<String, Integer> completedByCategory = new HashMap<>();
        
        for (Object[] result : results) {
            String categoryName = (String) result[0];
            Integer count = ((Number) result[1]).intValue();
            completedByCategory.put(categoryName, count);
        }
        
        return completedByCategory;
    }

    /**
     * Cuenta los cursos completados en un rango de fechas
     * @param start Fecha de inicio del rango
     * @param end Fecha de fin del rango
     * @return Número de cursos completados en el rango de fechas
     */
    public int countCoursesCompletedBetween(LocalDateTime start, LocalDateTime end) {
        return courseRepository.countCoursesCompletedBetween(start, end);
    }

    /**
     * Obtiene la distribución de inscripciones por categoría
     * @return Mapa con nombre de categoría y número de inscripciones
     */
    public Map<String, Integer> getEnrollmentCountByCategory() {
        List<Object[]> results = courseRepository.countEnrollmentsGroupByCategory();
        Map<String, Integer> enrollmentsByCategory = new HashMap<>();
        
        for (Object[] result : results) {
            String categoryName = (String) result[0];
            Integer count = ((Number) result[1]).intValue();
            enrollmentsByCategory.put(categoryName, count);
        }
        
        return enrollmentsByCategory;
    }

    /**
     * Calcula la tasa de compleción por categoría
     * @return Mapa con nombre de categoría y tasa de compleción
     */
    public Map<String, Double> getCompletionRateByCategory() {
        Map<String, Integer> enrollmentsByCategory = getEnrollmentCountByCategory();
        Map<String, Integer> completedByCategory = getCompletedCoursesByCategory();
        Map<String, Double> completionRateByCategory = new HashMap<>();
        
        for (String category : enrollmentsByCategory.keySet()) {
            int enrollments = enrollmentsByCategory.getOrDefault(category, 0);
            int completed = completedByCategory.getOrDefault(category, 0);
            
            double rate = enrollments > 0 ? (double) completed * 100 / enrollments : 0;
            completionRateByCategory.put(category, rate);
        }
        
        return completionRateByCategory;
    }

    /**
     * Cuenta las inscripciones por categoría en un rango de fechas
     * @param categoryName Nombre de la categoría
     * @param start Fecha de inicio del rango
     * @param end Fecha de fin del rango
     * @return Número de inscripciones en la categoría en el rango de fechas
     */
    public int countEnrollmentsByCategoryBetween(String categoryName, LocalDateTime start, LocalDateTime end) {
        return courseRepository.countEnrollmentsByCategoryBetween(categoryName, start, end);
    }

    /**
     * Inscribir a un usuario en un curso
     * @param userId ID del usuario
     * @param courseId ID del curso
     * @return Respuesta con los detalles de la inscripción
     */
    @Transactional
    public EnrollmentResponse enrollUserInCourse(Long userId, Long courseId) {
        log.info("Inscribiendo usuario {} en curso {}", userId, courseId);
        
        // Verificar que el usuario existe
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con ID: " + userId));
        
        // Verificar que el curso existe
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado con ID: " + courseId));
        
        // Verificar si ya está inscrito
        boolean alreadyEnrolled = enrollmentRepository.existsByUserAndCourse(user, course);
        if (alreadyEnrolled) {
            throw new IllegalStateException("El usuario ya está inscrito en este curso");
        }
        
        // Crear la inscripción
        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .course(course)
                .enrollmentDate(LocalDateTime.now())
                .progress(0)
                .completed(false)
                .build();
        
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        
        // Incrementar contador de inscritos en el curso
        course.setEnrolledCount(course.getEnrolledCount() + 1);
        courseRepository.save(course);
        
        // Actualizar la última actividad del usuario
        user.updateLastActivity();
        userRepository.save(user);
        
        // Notificar el evento de inscripción
        try {
            eventService.onCourseEnrollment(userId, courseId);
        } catch (Exception e) {
            log.error("Error al notificar evento de inscripción: {}", e.getMessage(), e);
            // No interrumpir el flujo si falla la notificación
        }
        
        // Crear y devolver la respuesta
        return EnrollmentResponse.builder()
                .id(savedEnrollment.getId())
                .userId(userId)
                .courseId(courseId)
                .courseName(course.getName())
                .enrollmentDate(savedEnrollment.getEnrollmentDate())
                .progress(0)
                .completed(false)
                .build();
    }

    /**
     * Completar un curso
     * @param userId ID del usuario
     * @param courseId ID del curso
     */
    @Transactional
    public void completeCourse(Long userId, Long courseId) {
        log.info("Marcando curso {} como completado para usuario {}", courseId, userId);
        
        // Buscar la inscripción
        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "No se encontró inscripción para el usuario " + userId + " en el curso " + courseId));
        
        // Marcar como completado y actualizar progreso
        enrollment.setCompleted(true);
        enrollment.setProgress(100);
        enrollment.setCompletionDate(LocalDateTime.now());
        enrollmentRepository.save(enrollment);
        
        // Actualizar la última actividad del usuario
        User user = enrollment.getUser();
        user.updateLastActivity();
        userRepository.save(user);
        
        // Notificar el evento de curso completado
        try {
            eventService.onCourseCompleted(userId, courseId);
        } catch (Exception e) {
            log.error("Error al notificar evento de curso completado: {}", e.getMessage(), e);
            // No interrumpir el flujo si falla la notificación
        }
    }
}