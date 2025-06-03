package com.empoderat.dto.module;

import com.empoderat.model.mysql.Module;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModuleResponse {

    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Module.Status status;
    private Long courseId;
    private String courseName;
    private boolean completed; // Nuevo campo para indicar si el módulo está completado

    /**
     * Convierte una entidad Module a un DTO ModuleResponse
     */
    public static ModuleResponse fromEntity(Module module) {
        return ModuleResponse.builder()
                .id(module.getId())
                .name(module.getName())
                .description(module.getDescription())
                .imageUrl(module.getImageUrl())
                .status(module.getStatus())
                .courseId(module.getCourse().getId())
                .courseName(module.getCourse().getName())
                .completed(false) // Por defecto false, se debe establecer externamente
                .build();
    }
}