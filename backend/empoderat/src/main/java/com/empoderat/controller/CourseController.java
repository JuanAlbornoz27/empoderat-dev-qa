package com.empoderat.controller;

import com.empoderat.dto.course.CourseRequest;
import com.empoderat.dto.course.CourseResponse;
import com.empoderat.service.CourseService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        List<CourseResponse> courses = courseService.getAllCoursesWithoutPagination(); //
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener curso por ID", description = "Devuelve un curso específico por su ID")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id) {
        try {
            CourseResponse course = courseService.getCourseById(id); 
            return ResponseEntity.ok(course);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Buscar cursos por categoría", description = "Devuelve una lista de cursos filtrados por categoría")
    public ResponseEntity<List<CourseResponse>> getCoursesByCategory(@PathVariable Long categoryId) {
        List<CourseResponse> courses = courseService.getCoursesByCategoryWithoutPagination(categoryId); //
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/search")
    @Operation(summary = "Buscar cursos por título o nombre", description = "Devuelve una lista de cursos filtrados por término de búsqueda en el nombre")
    public ResponseEntity<List<CourseResponse>> searchCourses(@RequestParam String query) {
        List<CourseResponse> courses = courseService.searchCoursesWithoutPagination(query); //
        return ResponseEntity.ok(courses);
    }

    @PostMapping
    @Operation(summary = "Crear nuevo curso", description = "Crea un nuevo curso con los datos proporcionados")
    @SecurityRequirement(name = "jwt") 
    public ResponseEntity<CourseResponse> createCourse(@RequestBody CourseRequest courseRequest) {
        try {
            CourseResponse createdCourse = courseService.createCourse(courseRequest); 
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
        } catch (IllegalArgumentException e) { 
            return ResponseEntity.badRequest().build(); 
        } catch (Exception e) {
            // Log e
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar curso existente", description = "Actualiza los datos de un curso existente por su ID")
    @SecurityRequirement(name = "jwt")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long id, @RequestBody CourseRequest courseRequest) {
        try {
            CourseResponse updatedCourse = courseService.updateCourse(id, courseRequest);
            return ResponseEntity.ok(updatedCourse);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar curso", description = "Elimina un curso por su ID")
    @SecurityRequirement(name = "jwt")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}