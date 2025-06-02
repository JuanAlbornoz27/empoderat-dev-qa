package com.empoderat.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.empoderat.dto.course.CourseResponse;
import com.empoderat.service.CourseService;
import com.empoderat.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/my-courses")
@RequiredArgsConstructor
@Tag(name = "Inscripciones", description = "Endpoints para gestión de inscripciones a cursos")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class EnrollmentController {

    private final CourseService courseService;
    private final UserService userService;

    @GetMapping
    @Operation(summary = "Obtener cursos inscritos del usuario autenticado", description = "Devuelve todos los cursos en los que está inscrito el usuario actual", security = @SecurityRequirement(name = "jwt"))
    public ResponseEntity<List<CourseResponse>> getMyEnrolledCourses() {
        try {
            String userEmail = userService.getCurrentUserProfile().getEmail();
            List<CourseResponse> enrolledCourses = courseService.getEnrolledCoursesByEmail(userEmail);
            return ResponseEntity.ok(enrolledCourses);
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener los cursos inscritos: " + e.getMessage());
        }
    }

    @PostMapping("/{courseId}")
    @Operation(summary = "Inscribirse en un curso", description = "Inscribe al usuario actual en un curso específico", security = @SecurityRequirement(name = "jwt"))
    public ResponseEntity<Void> enrollInCourse(@PathVariable Long courseId) {
        try {
            String userEmail = userService.getCurrentUserProfile().getEmail();
            courseService.enrollUserInCourse(userEmail, courseId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new RuntimeException("Error al inscribirse en el curso: " + e.getMessage());
        }
    }

    @DeleteMapping("/{courseId}")
    @Operation(summary = "Cancelar inscripción", description = "Cancela la inscripción del usuario actual en un curso específico", security = @SecurityRequirement(name = "jwt"))
    public ResponseEntity<Void> unenrollFromCourse(@PathVariable Long courseId) {
        try {
            String userEmail = userService.getCurrentUserProfile().getEmail();
            courseService.unenrollUserFromCourse(userEmail, courseId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new RuntimeException("Error al cancelar la inscripción: " + e.getMessage());
        }
    }
}