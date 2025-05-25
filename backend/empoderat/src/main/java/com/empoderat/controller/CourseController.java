package com.empoderat.controller;

import com.empoderat.dto.course.CourseResponse;
import com.empoderat.model.mysql.Course;
import com.empoderat.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

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
        List<Course> courses = courseService.getCoursesByCategory(categoryId);

        List<CourseResponse> response = courses.stream()
                .map(CourseResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Buscar cursos por título", description = "Devuelve una lista paginada de cursos filtrados por título")
    public ResponseEntity<Page<CourseResponse>> searchCourses(
            @RequestParam String query,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<CourseResponse> courses = courseService.searchCourses(query, pageable);
        return ResponseEntity.ok(courses);
    }
}