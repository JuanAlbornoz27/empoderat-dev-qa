package com.empoderat.service;

import com.empoderat.dto.progress.ProgressDTO;
import com.empoderat.model.mysql.Course;
import com.empoderat.model.neo4j.UserProgress;
import com.empoderat.repository.mysql.CourseRepository;
import com.empoderat.repository.neo4j.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final UserProgressRepository userProgressRepository;
    private final CourseRepository courseRepository;

    /**
     * Obtiene el progreso de todos los cursos de un usuario
     */
    @Transactional(readOnly = true)
    public List<ProgressDTO> getUserProgressByUserId(Long userId) {
        List<UserProgress> progressList = userProgressRepository.findByUserId(userId);
        
        return progressList.stream()
                .map(this::mapToProgressDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Obtiene el progreso de un usuario en un curso específico
     */
    @Transactional(readOnly = true)
    public Optional<ProgressDTO> getUserCourseProgress(Long userId, Long courseId) {
        return userProgressRepository.findByUserIdAndCourseId(userId, courseId)
                .map(this::mapToProgressDTO);
    }
    
    /**
     * Actualiza el progreso de un usuario en un curso
     */
    @Transactional
    public ProgressDTO updateUserProgress(Long userId, Long courseId, Integer percentage) {
        UserProgress progress = userProgressRepository.updateProgress(userId, courseId, percentage);
        return mapToProgressDTO(progress);
    }
    
    /**
     * Convierte una entidad UserProgress a un DTO
     */
    private ProgressDTO mapToProgressDTO(UserProgress progress) {
        String courseTitle = "";
        
        // Si el courseNode no está disponible, buscar en MySQL
        if (progress.getCourseNode() != null) {
            courseTitle = progress.getCourseNode().getTitle();
        } else {
            Optional<Course> course = courseRepository.findById(progress.getCourseId());
            if (course.isPresent()) {
                courseTitle = course.get().getTitle();
            }
        }
        
        return ProgressDTO.builder()
                .userId(progress.getUserId())
                .courseId(progress.getCourseId())
                .courseTitle(courseTitle)
                .percentage(progress.getProgress())
                .lastAccess(progress.getLastAccess())
                .completed(progress.getCompleted())
                .build();
    }
}