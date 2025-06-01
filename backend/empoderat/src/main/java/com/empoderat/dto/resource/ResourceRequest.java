package com.empoderat.dto.resource;

import com.empoderat.model.mongodb.Resource;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceRequest {
    
    @NotNull(message = "El ID del curso es obligatorio")
    private Long courseId;
    
    @NotNull(message = "El ID del módulo es obligatorio")
    private Long moduleId;
    
    @NotBlank(message = "El título es obligatorio")
    private String title;
    
    private String description;
    
    @NotNull(message = "El tipo de recurso es obligatorio")
    private Resource.ResourceType type;
    
    private String content;
    
    private String fileName;
    
    private String contentType;
}