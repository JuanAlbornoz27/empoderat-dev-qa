package com.empoderat.repository.mysql;

import com.empoderat.model.mysql.Module;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    
    List<Module> findByCourseId(Long courseId);
    
    Page<Module> findByCourseId(Long courseId, Pageable pageable);
    
    Page<Module> findByCourseIdAndStatus(Long courseId, Module.Status status, Pageable pageable);
    
    int countByCourseId(Long courseId);
    
    int countByCourseIdAndStatus(Long courseId, Module.Status status);
}