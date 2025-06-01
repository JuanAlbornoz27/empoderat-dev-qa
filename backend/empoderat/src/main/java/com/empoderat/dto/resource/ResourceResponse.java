package com.empoderat.dto.resource;

import com.empoderat.model.mongodb.Resource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceResponse {
    
    private String id;
    private Long courseId;
    private Long moduleId;
    private String title;
    private String description;
    private Resource.ResourceType type;
    private String content;
    private String fileName;
    private String contentType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static ResourceResponse fromEntity(Resource resource) {
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