package com.empoderat.controller;

import com.empoderat.dto.course.CourseResponse;
import com.empoderat.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Tag(name = "Cursos", description = "Endpoints para gestión de cursos")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    @Operation(summary = "Obtener todos los cursos", description = "Devuelve todos los cursos disponibles")
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        List<CourseResponse> courses = courseService.getAllCoursesWithoutPagination();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Buscar cursos por categoría", description = "Devuelve una lista de cursos filtrados por categoría", security = @SecurityRequirement(name = "jwt"))
    public ResponseEntity<List<CourseResponse>> getCoursesByCategory(
            @PathVariable Long categoryId) {
        List<CourseResponse> courses = courseService.getCoursesByCategoryWithoutPagination(categoryId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/search")
    @Operation(summary = "Buscar cursos por título", description = "Devuelve una lista de cursos filtrados por título")
    public ResponseEntity<List<CourseResponse>> searchCourses(
            @RequestParam String query) {
        List<CourseResponse> courses = courseService.searchCoursesWithoutPagination(query);
        return ResponseEntity.ok(courses);
    }
}