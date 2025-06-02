package com.empoderat.repository.mysql;

import com.empoderat.dto.course.CourseResponse;
import com.empoderat.model.mysql.Category;
import com.empoderat.model.mysql.Course;
import com.empoderat.model.mysql.Course.Status;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByStatus(Course.Status status);

    List<Course> findByCategoryId(Long categoryId);

    List<Course> findByCategory(Category category);

    List<Course> findByNameContainingIgnoreCase(String name);
}