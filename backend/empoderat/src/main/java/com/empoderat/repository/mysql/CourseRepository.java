package com.empoderat.repository.mysql;

import com.empoderat.model.mysql.Category;
import com.empoderat.model.mysql.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    List<Course> findByCategory(Category category);
    
    Page<Course> findByCategory(Category category, Pageable pageable);
    
    Page<Course> findByNameContainingIgnoreCase(String title, Pageable pageable);
}