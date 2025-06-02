package com.empoderat.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.empoderat.dto.course.CourseResponse;
import com.empoderat.service.CourseService;
import com.empoderat.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/my-courses")
@RequiredArgsConstructor
@Tag(name = "Inscripciones", description = "Endpoints para gestión de inscripciones a cursos")

@Slf4j
public class EnrollmentController {

    private final CourseService courseService;
    private final SecurityUtil securityUtil;

    @GetMapping
    @Operation(summary = "Obtener cursos inscritos del usuario autenticado", description = "Devuelve todos los cursos en los que está inscrito el usuario actual", security = @SecurityRequirement(name = "jwt"))
    public ResponseEntity<List<CourseResponse>> getMyEnrolledCourses() {
        try {
            log.info("Obteniendo cursos inscritos para el usuario actual");
            String userEmail = securityUtil.getCurrentUserEmail();
            log.info("Email del usuario actual: {}", userEmail);

            List<CourseResponse> enrolledCourses = courseService.getEnrolledCoursesByEmail(userEmail);
            log.info("Encontrados {} cursos inscritos", enrolledCourses.size());

            return ResponseEntity.ok(enrolledCourses);
        } catch (Exception e) {
            log.error("Error al obtener los cursos inscritos", e);
            throw new RuntimeException("Error al obtener los cursos inscritos: " + e.getMessage());
        }
    }

    

    @DeleteMapping("/{courseId}")
    @Operation(summary = "Cancelar inscripción", description = "Cancela la inscripción del usuario actual en un curso específico", security = @SecurityRequirement(name = "jwt"))
    public ResponseEntity<Void> unenrollFromCourse(@PathVariable Long courseId) {
        try {
            log.info("Cancelando inscripción del usuario en curso con ID: {}", courseId);
            String userEmail = securityUtil.getCurrentUserEmail();
            log.info("Email del usuario: {}", userEmail);

            courseService.unenrollUserFromCourse(userEmail, courseId);
            log.info("Inscripción cancelada exitosamente");

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error al cancelar la inscripción", e);
            throw new RuntimeException("Error al cancelar la inscripción: " + e.getMessage());
        }
    }
}
