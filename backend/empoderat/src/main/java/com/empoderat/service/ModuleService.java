package com.empoderat.service;

import com.empoderat.dto.module.ModuleRequest;
import com.empoderat.dto.module.ModuleResponse;
import com.empoderat.model.mysql.Course;
import com.empoderat.model.mysql.Module;
import com.empoderat.model.mysql.User;
import com.empoderat.repository.mysql.CourseRepository;
import com.empoderat.repository.mysql.ModuleRepository;
import com.empoderat.repository.mysql.UserRepository;
import com.empoderat.util.SecurityUtil;
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
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;
    @Autowired
    private EventService eventService;

    public List<ModuleResponse> getAllModules() {
        return moduleRepository.findAll().stream()
                .map(ModuleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene los módulos de un curso para el usuario autenticado
     * Incluye información sobre si el módulo está completado
     */
    public List<ModuleResponse> getModulesByCourseForUser(Long courseId) {
        // Verificar si el curso existe
        if (!courseRepository.existsById(courseId)) {
            throw new EntityNotFoundException("No se encontró el curso con ID: " + courseId);
        }

        // Obtener el usuario actual
        String userEmail = securityUtil.getCurrentUserEmail();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        // Verificar si el usuario está inscrito en el curso
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado"));

        boolean isEnrolled = currentUser.getEnrolledCourses().contains(course);
        if (!isEnrolled) {
            throw new IllegalStateException("El usuario no está inscrito en este curso");
        }

        // Obtener módulos del curso
        List<Module> modules = moduleRepository.findByCourseIdAndStatus(courseId, Module.Status.ACTIVE);

        // Obtener IDs de módulos completados por el usuario
        List<Long> completedModuleIds = currentUser.getCompletedModules().stream()
                .map(Module::getId)
                .collect(Collectors.toList());

        return modules.stream()
                .map(module -> {
                    ModuleResponse response = ModuleResponse.fromEntity(module);
                    response.setCompleted(completedModuleIds.contains(module.getId()));
                    return response;
                })
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

        existingModule.setStatus(status);
        Module savedModule = moduleRepository.save(existingModule);
        return ModuleResponse.fromEntity(savedModule);
    }

    public ModuleResponse getModuleById(Long moduleId) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró el módulo con ID: " + moduleId));
        return ModuleResponse.fromEntity(module);
    }

    /**
     * Marca un módulo como completado para el usuario autenticado
     */
    public void markModuleAsCompleted(Long moduleId) {
        // Obtener el usuario actual
        String userEmail = securityUtil.getCurrentUserEmail();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        // Obtener el módulo
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new EntityNotFoundException("Módulo no encontrado"));

        // Verificar que el usuario esté inscrito en el curso del módulo
        boolean isEnrolled = currentUser.getEnrolledCourses().contains(module.getCourse());
        if (!isEnrolled) {
            throw new IllegalStateException("El usuario no está inscrito en el curso de este módulo");
        }

        // Agregar el módulo a la lista de completados si no está ya
        if (!currentUser.getCompletedModules().contains(module)) {
            currentUser.getCompletedModules().add(module);
            userRepository.save(currentUser);
        }
        // Notificar el evento de módulo completado
        eventService.onModuleCompleted(currentUser.getId(), moduleId);
    }

    /**
     * Desmarca un módulo como completado para el usuario autenticado
     */
    public void unmarkModuleAsCompleted(Long moduleId) {
        // Obtener el usuario actual
        String userEmail = securityUtil.getCurrentUserEmail();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        // Obtener el módulo
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new EntityNotFoundException("Módulo no encontrado"));

        // Remover el módulo de la lista de completados
        currentUser.getCompletedModules().remove(module);
        userRepository.save(currentUser);
    }
}