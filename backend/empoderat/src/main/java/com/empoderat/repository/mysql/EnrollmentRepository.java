package com.empoderat.repository.mysql;

import com.empoderat.model.mysql.Course;
import com.empoderat.model.mysql.Enrollment;
import com.empoderat.model.mysql.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    /**
     * Verifica si existe una inscripción para un usuario y curso específicos
     */
    boolean existsByUserAndCourse(User user, Course course);

    /**
     * Encuentra una inscripción por el ID de usuario y el ID de curso
     */
    Optional<Enrollment> findByUserIdAndCourseId(Long userId, Long courseId);

    /**
     * Cuenta inscripciones por usuario
     */
    int countByUserId(Long userId);

    /**
     * Cuenta inscripciones por curso
     */
    int countByCourseId(Long courseId);

    /**
     * Encuentra todas las inscripciones de un usuario
     */
    List<Enrollment> findByUserId(Long userId);

    /**
     * Encuentra todas las inscripciones para un curso
     */
    List<Enrollment> findByCourseId(Long courseId);

    /**
     * Encuentra inscripciones completadas por usuario
     */
    List<Enrollment> findByUserIdAndCompletedTrue(Long userId);

    /**
     * Encuentra inscripciones por fecha de inscripción
     */
    List<Enrollment> findByEnrollmentDateBetween(LocalDateTime start, LocalDateTime end);
}