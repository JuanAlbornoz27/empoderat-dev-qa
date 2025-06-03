package com.empoderat.repository.mongodb;

import com.empoderat.model.mongodb.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

    /**
     * Encuentra recursos por ID del curso
     */
    List<Resource> findByCourseId(Long courseId);

    /**
     * Encuentra recursos por ID del módulo
     */
    List<Resource> findByModuleId(Long moduleId);

    /**
     * Encuentra recursos por ID del curso y del módulo
     */
    List<Resource> findByCourseIdAndModuleId(Long courseId, Long moduleId);

    /**
     * Encuentra recursos por ID del curso y tipo de recurso
     */
    List<Resource> findByCourseIdAndType(Long courseId, Resource.ResourceType type);

    /**
     * Encuentra recursos por título (búsqueda parcial, no sensible a
     * mayúsculas/minúsculas)
     */
    List<Resource> findByTitleContainingIgnoreCase(String title);

    /**
     * Encuentra un recurso específico por todos sus identificadores
     */
    Optional<Resource> findByCourseIdAndModuleIdAndId(Long courseId, Long moduleId, String id);
}