package com.empoderat.service;

import com.empoderat.dto.module.ModuleRequest;
import com.empoderat.dto.module.ModuleResponse;
import com.empoderat.model.mysql.Course;
import com.empoderat.model.mysql.Module;
import com.empoderat.repository.mysql.CourseRepository;
import com.empoderat.repository.mysql.ModuleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final CourseRepository courseRepository;

    // Añadir la inyección del EventService
    @Autowired
    private EventService eventService;

    public List<ModuleResponse> getAllModules() {
        return moduleRepository.findAll().stream()
                .map(ModuleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ModuleResponse> getModulesByCourse(Long courseId) {
        // Verificar si el curso existe
        if (!courseRepository.existsById(courseId)) {
            throw new EntityNotFoundException("No se encontró el curso con ID: " + courseId);
        }

        return moduleRepository.findByCourseId(courseId).stream()
                .map(ModuleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ModuleResponse> searchModules(String term) {
        return moduleRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(term, term).stream()
                .map(ModuleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ModuleResponse createModule(ModuleRequest moduleRequest) {
        // Verificar si el curso existe
        Course course = courseRepository.findById(moduleRequest.getCourseId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "No se encontró el curso con ID: " + moduleRequest.getCourseId()));

        // Crear el módulo
        Module module = Module.builder()
                .name(moduleRequest.getName())
                .description(moduleRequest.getDescription())
                .imageUrl(moduleRequest.getImageUrl())
                .status(moduleRequest.getStatus())
                .course(course)
                .build();

        Module savedModule = moduleRepository.save(module);
        return ModuleResponse.fromEntity(savedModule);
    }

    public ModuleResponse updateModule(Long id, ModuleRequest moduleRequest) {
        Module existingModule = moduleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró el módulo con ID: " + id));

        // Actualizar campos
        existingModule.setName(moduleRequest.getName());
        existingModule.setDescription(moduleRequest.getDescription());
        existingModule.setImageUrl(moduleRequest.getImageUrl());
        existingModule.setStatus(moduleRequest.getStatus());

        // Si cambia el curso, verificar que existe
        if (!existingModule.getCourse().getId().equals(moduleRequest.getCourseId())) {
            Course course = courseRepository.findById(moduleRequest.getCourseId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "No se encontró el curso con ID: " + moduleRequest.getCourseId()));
            existingModule.setCourse(course);
        }

        Module savedModule = moduleRepository.save(existingModule);
        return ModuleResponse.fromEntity(savedModule);
    }

    public void deleteModule(Long id) {
        if (!moduleRepository.existsById(id)) {
            throw new EntityNotFoundException("No se encontró el módulo con ID: " + id);
        }

        moduleRepository.deleteById(id);
    }

    public ModuleResponse updateModuleStatus(Long id, Module.Status status) {
        Module existingModule = moduleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró el módulo con ID: " + id));

        // Validar el estado (esto es manejado por la enumeración en el modelo)
        existingModule.setStatus(status);
        Module savedModule = moduleRepository.save(existingModule);
        return ModuleResponse.fromEntity(savedModule);
    }

    // Añade este método a tu moduleService en src/services/api.js
    public ModuleResponse getModuleById(Long moduleId) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró el módulo con ID: " + moduleId));
        return ModuleResponse.fromEntity(module);
    }

    // Modificar el método de completar módulo
    @Transactional
    public void completeModule(Long userId, Long moduleId) {
        // Código existente para marcar el módulo como completado...

        // Notificar el evento de módulo completado
        eventService.onModuleCompleted(userId, moduleId);
    }
}