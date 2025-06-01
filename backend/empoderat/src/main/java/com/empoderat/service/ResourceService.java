package com.empoderat.service;

import com.empoderat.dto.resource.ResourceRequest;
import com.empoderat.dto.resource.ResourceResponse;
import com.empoderat.exception.ResourceNotFoundException;
import com.empoderat.model.mongodb.Resource;
import com.empoderat.repository.mongodb.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResourceService {
    
    private final ResourceRepository resourceRepository;
    
    // Directorio para almacenar archivos (ajustar según configuración)
    private static final String UPLOAD_DIR = "uploads";
    
    /**
     * Obtiene todos los recursos
     */
    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene un recurso por su ID
     */
    public ResourceResponse getResourceById(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recurso", "id", id));
        return mapToResponse(resource);
    }
    
    /**
     * Obtiene recursos por ID del módulo
     */
    public List<ResourceResponse> getResourcesByModule(Long moduleId) {
        return resourceRepository.findByModuleId(moduleId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Crea un nuevo recurso
     */
    public ResourceResponse createResource(ResourceRequest resourceRequest) {
        Resource resource = Resource.builder()
                .courseId(resourceRequest.getCourseId())
                .moduleId(resourceRequest.getModuleId())
                .title(resourceRequest.getTitle())
                .description(resourceRequest.getDescription())
                .type(resourceRequest.getType())
                .content(resourceRequest.getContent())
                .fileName(resourceRequest.getFileName())
                .contentType(resourceRequest.getContentType())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        Resource savedResource = resourceRepository.save(resource);
        log.info("Recurso creado con éxito: {}", savedResource.getId());
        return mapToResponse(savedResource);
    }
    
    /**
     * Actualiza un recurso existente
     */
    public ResourceResponse updateResource(String id, ResourceRequest resourceRequest) {
        Resource existingResource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recurso", "id", id));
        
        existingResource.setTitle(resourceRequest.getTitle());
        existingResource.setDescription(resourceRequest.getDescription());
        existingResource.setType(resourceRequest.getType());
        existingResource.setContent(resourceRequest.getContent());
        existingResource.setFileName(resourceRequest.getFileName());
        existingResource.setContentType(resourceRequest.getContentType());
        existingResource.setUpdatedAt(LocalDateTime.now());
        
        Resource updatedResource = resourceRepository.save(existingResource);
        log.info("Recurso actualizado con éxito: {}", updatedResource.getId());
        return mapToResponse(updatedResource);
    }
    
    /**
     * Elimina un recurso
     */
    public void deleteResource(String id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Recurso", "id", id);
        }
        
        resourceRepository.deleteById(id);
        log.info("Recurso eliminado con éxito: {}", id);
    }
    
    /**
     * Sube un archivo y devuelve la URL
     */
    public String uploadFile(MultipartFile file) throws IOException {
        // Crear directorio si no existe
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generar nombre único para el archivo
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        // Guardar archivo
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);
        
        // Retornar URL relativa al archivo
        return "/api/resources/files/" + uniqueFileName;
    }
    
    /**
     * Convierte entidad a DTO de respuesta
     */
    private ResourceResponse mapToResponse(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .courseId(resource.getCourseId())
                .moduleId(resource.getModuleId())
                .title(resource.getTitle())
                .description(resource.getDescription())
                .type(resource.getType())
                .content(resource.getContent())
                .fileName(resource.getFileName())
                .contentType(resource.getContentType())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}