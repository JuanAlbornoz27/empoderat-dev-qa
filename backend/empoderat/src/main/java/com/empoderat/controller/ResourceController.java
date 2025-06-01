package com.empoderat.controller;

import com.empoderat.dto.resource.ResourceRequest;
import com.empoderat.dto.resource.ResourceResponse;
import com.empoderat.exception.ResourceNotFoundException;
import com.empoderat.service.ResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Recursos", description = "Endpoints para gestión de recursos multimedia")
public class ResourceController {
    
    private final ResourceService resourceService;
    
    @GetMapping
    @Operation(summary = "Obtener todos los recursos", description = "Devuelve todos los recursos disponibles")
    public ResponseEntity<List<ResourceResponse>> getAllResources() {
        List<ResourceResponse> resources = resourceService.getAllResources();
        return ResponseEntity.ok(resources);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener recurso por ID", description = "Devuelve un recurso específico por su ID")
    public ResponseEntity<ResourceResponse> getResourceById(@PathVariable String id) {
        try {
            ResourceResponse resource = resourceService.getResourceById(id);
            return ResponseEntity.ok(resource);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/module/{moduleId}")
    @Operation(summary = "Obtener recursos por módulo", description = "Devuelve todos los recursos asociados a un módulo específico")
    public ResponseEntity<List<ResourceResponse>> getResourcesByModule(@PathVariable Long moduleId) {
        List<ResourceResponse> resources = resourceService.getResourcesByModule(moduleId);
        return ResponseEntity.ok(resources);
    }
    
    @PostMapping
    @Operation(summary = "Crear nuevo recurso", description = "Crea un nuevo recurso con los datos proporcionados")
    public ResponseEntity<ResourceResponse> createResource(@Valid @RequestBody ResourceRequest resourceRequest) {
        try {
            ResourceResponse createdResource = resourceService.createResource(resourceRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdResource);
        } catch (Exception e) {
            log.error("Error al crear el recurso", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar recurso", description = "Actualiza los datos de un recurso existente")
    public ResponseEntity<ResourceResponse> updateResource(
            @PathVariable String id,
            @Valid @RequestBody ResourceRequest resourceRequest) {
        try {
            ResourceResponse updatedResource = resourceService.updateResource(id, resourceRequest);
            return ResponseEntity.ok(updatedResource);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error al actualizar el recurso", e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar recurso", description = "Elimina un recurso por su ID")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        try {
            resourceService.deleteResource(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error al eliminar el recurso", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/upload")
    @Operation(summary = "Subir archivo", description = "Sube un archivo y devuelve la URL para referenciarlo")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = resourceService.uploadFile(file);
            
            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", fileUrl);
            response.put("fileName", file.getOriginalFilename());
            response.put("contentType", file.getContentType());
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            log.error("Error al subir el archivo", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/files/{fileName:.+}")
    @Operation(summary = "Descargar archivo", description = "Descarga un archivo específico por su nombre")
    public ResponseEntity<byte[]> getFile(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("uploads").resolve(fileName).normalize();
            byte[] content = Files.readAllBytes(filePath);
            
            // Determinar Content-Type basado en la extensión del archivo
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                    .header("Content-Type", contentType)
                    .header("Content-Disposition", "inline; filename=\"" + fileName + "\"")
                    .body(content);
        } catch (IOException e) {
            log.error("Error al obtener el archivo: " + fileName, e);
            return ResponseEntity.notFound().build();
        }
    }
}