package com.empoderat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EstadisticaService estadisticaService;

    /**
     * Método llamado cuando se registra un nuevo usuario
     * @param userId ID del usuario registrado
     */
    public void onUserRegistered(Long userId) {
        log.info("Evento detectado: Nuevo usuario registrado con ID: {}", userId);
        try {
            estadisticaService.actualizarEstadisticasUsuarios();
        } catch (Exception e) {
            log.error("Error al actualizar estadísticas tras registro de usuario: {}", e.getMessage(), e);
        }
    }

    /**
     * Método llamado cuando un usuario se inscribe en un curso
     * @param userId ID del usuario
     * @param courseId ID del curso
     */
    public void onCourseEnrollment(Long userId, Long courseId) {
        log.info("Evento detectado: Usuario {} inscrito en curso {}", userId, courseId);
        try {
            estadisticaService.actualizarEstadisticasInscripciones();
        } catch (Exception e) {
            log.error("Error al actualizar estadísticas tras inscripción a curso: {}", e.getMessage(), e);
        }
    }

    /**
     * Método llamado cuando un usuario completa un curso
     * @param userId ID del usuario
     * @param courseId ID del curso
     */
    public void onCourseCompleted(Long userId, Long courseId) {
        log.info("Evento detectado: Usuario {} completó curso {}", userId, courseId);
        try {
            estadisticaService.actualizarEstadisticasCursosCompletados();
        } catch (Exception e) {
            log.error("Error al actualizar estadísticas tras completar curso: {}", e.getMessage(), e);
        }
    }

    /**
     * Método llamado cuando un usuario completa un módulo
     * @param userId ID del usuario
     * @param moduleId ID del módulo
     */
    public void onModuleCompleted(Long userId, Long moduleId) {
        log.info("Evento detectado: Usuario {} completó módulo {}", userId, moduleId);
        try {
            // Dependiendo de tus necesidades, podrías actualizar estadísticas específicas de módulos
            // O simplemente actualizar las estadísticas generales
            estadisticaService.actualizarEstadisticasCursosCompletados();
        } catch (Exception e) {
            log.error("Error al actualizar estadísticas tras completar módulo: {}", e.getMessage(), e);
        }
    }
}