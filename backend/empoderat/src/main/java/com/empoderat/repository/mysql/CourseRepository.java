package com.empoderat.repository.mysql;

import com.empoderat.model.mysql.Category;
import com.empoderat.model.mysql.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    List<Course> findByCategory(Category category);
    List<Course> findByNameContainingIgnoreCase(String name);
}