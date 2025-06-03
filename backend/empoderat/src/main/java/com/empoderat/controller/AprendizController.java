package com.empoderat.controller;

import com.empoderat.dto.course.CourseResponse;
import com.empoderat.service.AprendizService;
import com.empoderat.util.SecurityUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aprendiz")
@RequiredArgsConstructor
@Slf4j
public class AprendizController {

    private final AprendizService aprendizService;
    private final SecurityUtil securityUtil;

    /**
     * Inscribe al usuario en un curso
     */
    @PostMapping("/courses/{courseId}/enroll")
    @Operation(summary = "Inscribe al usuario en un curso", security = @SecurityRequirement(name = "jwt"))
    public ResponseEntity<CourseResponse> enrollInCourse(@PathVariable Long courseId) {
        try {
            log.info("Intento de inscripción al curso con ID: {}", courseId);
            String email = securityUtil.getCurrentUserEmail(); // Usando SecurityUtil
            log.info("Usuario con email {} intentando inscribirse", email);

            aprendizService.enrollUserInCourse(email, courseId);
            log.info("Inscripción exitosa al curso {} para el usuario {}", courseId, email);

            return ResponseEntity.ok().build();

        } catch (IllegalStateException e) {
            log.warn("Error de validación en inscripción: {}", e.getMessage());
            return ResponseEntity.badRequest().build();

        } catch (Exception e) {
            log.error("Error inesperado en inscripción: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Abandona un curso
     */
    @DeleteMapping("/courses/{courseId}/drop")
    public ResponseEntity<Void> dropCourse(@PathVariable Long courseId) {
        try {
            log.info("Intento de abandonar el curso con ID: {}", courseId);
            String email = securityUtil.getCurrentUserEmail(); // Usando SecurityUtil

            aprendizService.dropCourse(courseId);
            log.info("Usuario {} abandonó exitosamente el curso {}", email, courseId);

            return ResponseEntity.noContent().build();

        } catch (Exception e) {
            log.error("Error al abandonar el curso: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtiene todos los cursos disponibles para inscripción
     */
    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponse>> getAvailableCourses() {
        try {
            log.info("Obteniendo cursos disponibles");
            List<CourseResponse> courses = aprendizService.getAvailableCourses();
            log.info("Se encontraron {} cursos disponibles", courses.size());

            return ResponseEntity.ok(courses);

        } catch (Exception e) {
            log.error("Error al obtener cursos disponibles: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}