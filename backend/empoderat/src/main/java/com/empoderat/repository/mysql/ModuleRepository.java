package com.empoderat.repository.mysql;

import com.empoderat.model.mysql.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {

    /**
     * Busca módulos por curso
     */
    List<Module> findByCourseId(Long courseId);

    /**
     * Busca módulos por nombre o descripción
     */
    List<Module> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

    /**
     * Busca módulos por estado
     */
    List<Module> findByStatus(Module.Status status);

    /**
     * Busca módulos por curso y estado
     */
    List<Module> findByCourseIdAndStatus(Long courseId, Module.Status status);
}