package com.empoderat.model.mongodb;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection = "resources")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resource {
    
    @Id
    private String id;
    
    @Field("course_id")
    private Long courseId;
    
    @Field("module_id")
    private Long moduleId;
    
    // Campos que necesitas agregar
    private String title;
    
    private String description;
    
    @Field("resource_type")
    private ResourceType type;
    
    // Contenido binario o URL al recurso
    private String content;
    
    @Field("file_name")
    private String fileName;
    
    @Field("content_type")
    private String contentType;
    
    @Field("created_at")
    private LocalDateTime createdAt;
    
    @Field("updated_at")
    private LocalDateTime updatedAt;
    
    public enum ResourceType {
        VIDEO, IMAGE, DOCUMENT, AUDIO, LINK
    }
}