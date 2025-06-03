package com.empoderat.controller;

import com.empoderat.dto.module.ModuleResponse;
import com.empoderat.dto.module.ModuleRequest;
import com.empoderat.model.mysql.Module;
import com.empoderat.service.ModuleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
@Tag(name = "Módulos", description = "Endpoints para gestión de módulos")
public class ModuleController {

    private final ModuleService moduleService;

    @GetMapping
    @Operation(summary = "Obtener todos los módulos", description = "Devuelve todos los módulos disponibles")
    public ResponseEntity<List<ModuleResponse>> getAllModules() {
        List<ModuleResponse> modules = moduleService.getAllModules();
        return ResponseEntity.ok(modules);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener módulo por ID", description = "Devuelve un módulo específico por su ID")
    public ResponseEntity<ModuleResponse> getModuleById(@PathVariable Long id) {
        try {
            ModuleResponse module = moduleService.getModuleById(id);
            return ResponseEntity.ok(module);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/course/{courseId}")
    @Operation(summary = "Obtener módulos por curso", description = "Devuelve todos los módulos asociados a un curso específico")
    public ResponseEntity<List<ModuleResponse>> getModulesByCourse(@PathVariable Long courseId) {
        List<ModuleResponse> modules = moduleService.getModulesByCourse(courseId);
        return ResponseEntity.ok(modules);
    }

    @GetMapping("/course/{courseId}/user")
    @Operation(summary = "Obtener módulos por curso para usuario autenticado", description = "Devuelve todos los módulos de un curso con información de completado para el usuario actual")
    public ResponseEntity<List<ModuleResponse>> getModulesByCourseForUser(@PathVariable Long courseId) {
        try {
            List<ModuleResponse> modules = moduleService.getModulesByCourseForUser(courseId);
            return ResponseEntity.ok(modules);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Buscar módulos", description = "Busca módulos por nombre o descripción")
    public ResponseEntity<List<ModuleResponse>> searchModules(@RequestParam String term) {
        List<ModuleResponse> modules = moduleService.searchModules(term);
        return ResponseEntity.ok(modules);
    }

    @PostMapping
    @Operation(summary = "Crear nuevo módulo", description = "Crea un nuevo módulo con los datos proporcionados")
    public ResponseEntity<ModuleResponse> createModule(@RequestBody ModuleRequest moduleRequest) {
        try {
            ModuleResponse createdModule = moduleService.createModule(moduleRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdModule);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar módulo", description = "Actualiza los datos de un módulo existente")
    public ResponseEntity<ModuleResponse> updateModule(@PathVariable Long id,
            @RequestBody ModuleRequest moduleRequest) {
        try {
            ModuleResponse module = moduleService.updateModule(id, moduleRequest);
            return ResponseEntity.ok(module);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar módulo", description = "Elimina un módulo por su ID")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        try {
            moduleService.deleteModule(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Actualizar estado del módulo", description = "Actualiza solo el estado de un módulo existente")
    public ResponseEntity<ModuleResponse> updateModuleStatus(
            @PathVariable Long id,
            @RequestBody ModuleStatusUpdateRequest request) {
        try {
            ModuleResponse module = moduleService.updateModuleStatus(id, request.getStatus());
            return ResponseEntity.ok(module);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Marcar módulo como completado", description = "Marca un módulo como completado para el usuario autenticado")
    public ResponseEntity<Void> markModuleAsCompleted(@PathVariable Long id) {
        try {
            moduleService.markModuleAsCompleted(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/{id}/complete")
    @Operation(summary = "Desmarcar módulo como completado", description = "Desmarca un módulo como completado para el usuario autenticado")
    public ResponseEntity<Void> unmarkModuleAsCompleted(@PathVariable Long id) {
        try {
            moduleService.unmarkModuleAsCompleted(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Clase interna para la solicitud de actualización de estado
    private static class ModuleStatusUpdateRequest {
        private Module.Status status;

        public Module.Status getStatus() {
            return status;
        }

        public void setStatus(Module.Status status) {
            this.status = status;
        }
    }
}