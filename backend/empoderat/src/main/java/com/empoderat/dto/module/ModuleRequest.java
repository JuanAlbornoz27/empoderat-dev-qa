package com.empoderat.dto.module;

import com.empoderat.model.mysql.Module;
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
public class ModuleRequest {
    
    @NotBlank(message = "El nombre es obligatorio")
    private String name;
    
    private String description;
    
    private String imageUrl;
    
    @NotNull(message = "El estado es obligatorio")
    private Module.Status status;
    
    @NotNull(message = "El ID del curso es obligatorio")
    private Long courseId;
}