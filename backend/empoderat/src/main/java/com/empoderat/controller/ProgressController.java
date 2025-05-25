package com.empoderat.controller;

import com.empoderat.dto.progress.ProgressDTO;
import com.empoderat.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@Tag(name = "Progreso", description = "Endpoints para gestión de progreso de usuarios")
public class ProgressController {

    private final ProgressService progressService;

    @GetMapping("/{userId}")
    @Operation(
        summary = "Obtener progreso del usuario", 
        description = "Devuelve el progreso del usuario en todos sus cursos",
        security = @SecurityRequirement(name = "jwt")
    )
    public ResponseEntity<List<ProgressDTO>> getUserProgress(@PathVariable Long userId) {
        List<ProgressDTO> progressList = progressService.getUserProgressByUserId(userId);
        return ResponseEntity.ok(progressList);
    }
    
    @GetMapping("/{userId}/course/{courseId}")
    @Operation(
        summary = "Obtener progreso de un curso específico", 
        description = "Devuelve el progreso del usuario en un curso específico",
        security = @SecurityRequirement(name = "jwt")
    )
    public ResponseEntity<ProgressDTO> getUserCourseProgress(
            @PathVariable Long userId, 
            @PathVariable Long courseId) {
        return progressService.getUserCourseProgress(userId, courseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}