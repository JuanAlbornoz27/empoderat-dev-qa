package com.empoderat.service;

import com.empoderat.dto.course.CourseResponse;
import com.empoderat.model.mysql.Course;
import com.empoderat.model.mysql.User;
import com.empoderat.repository.mysql.CourseRepository;
import com.empoderat.repository.mysql.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AprendizService {
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    /**
     * Obtiene todos los cursos disponibles para inscripción
     */
    @Transactional(readOnly = true)
    public List<CourseResponse> getAvailableCourses() {
        return courseRepository.findByStatus(Course.Status.ACTIVE).stream()
                .map(CourseResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene los cursos de un usuario específico (para admin)
     */
    // @Transactional(readOnly = true)
    // public List<MyCourseResponse> getUserCourses(Long userId) {
    // if (!userRepository.existsById(userId)) {
    // throw new EntityNotFoundException("Usuario no encontrado con ID: " + userId);
    // }
    // List<Course> enrollments =
    // enrollmentRepository.findUserCoursesWithProgress(userId);

    // return enrollments.stream()
    // .map(MyCourseResponse::fromEnrollment)
    // .collect(Collectors.toList());
    // }

    /**
     * Inscribe al usuario actual en un curso
     */
    @Transactional
    public void enrollUserInCourse(String email, Long courseId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado"));

        if (user.getEnrolledCourses().contains(course)) {
            throw new IllegalStateException("El usuario ya está inscrito en este curso");
        }

        user.getEnrolledCourses().add(course);
        course.setEnrolledCount(course.getEnrolledCount() + 1);

        userRepository.save(user);
        courseRepository.save(course);
    }

    /**
     * Actualiza el progreso de un curso
     */
    // @Transactional
    // public MyCourseResponse updateProgress(Long courseId, Double progress) {
    // Long userId = getCurrentUserId();

    // Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId,
    // courseId)
    // .orElseThrow(() -> new EntityNotFoundException("No estás inscrito en este
    // curso"));

    // enrollment.setProgress(Math.min(100.0, Math.max(0.0, progress)));
    // enrollment.setLastAccessed(LocalDateTime.now());

    // // Si el progreso es 100%, marcar como completado
    // if (progress >= 100.0) {
    // enrollment.setStatus(Enrollment.EnrollmentStatus.COMPLETED);
    // enrollment.setCompletionDate(LocalDateTime.now());
    // } else if (enrollment.getStatus() == Enrollment.EnrollmentStatus.ENROLLED) {
    // enrollment.setStatus(Enrollment.EnrollmentStatus.IN_PROGRESS);
    // }

    // Enrollment updatedEnrollment = enrollmentRepository.save(enrollment);

    // return MyCourseResponse.fromEnrollment(updatedEnrollment);
    // }

    /**
     * Abandona un curso
     */
    @Transactional
    public void dropCourse(Long courseId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Verificar si está inscrito usando el método existente
        if (!isEnrolledInCourse(email, courseId)) {
            throw new IllegalStateException("No estás inscrito en este curso");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado"));

        // Remover el curso y actualizar contador
        user.getEnrolledCourses().remove(course);
        course.setEnrolledCount(Math.max(0, course.getEnrolledCount() - 1));

        // Guardar cambios
        userRepository.save(user);
        courseRepository.save(course);
    }

    /**
     * Verifica si el usuario está inscrito en un curso
     */
    @Transactional(readOnly = true)
    public boolean isEnrolledInCourse(String email, Long courseId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado"));

        return user.getEnrolledCourses().contains(course);
    }

}