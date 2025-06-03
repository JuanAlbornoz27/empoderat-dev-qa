package com.empoderat.repository.mysql;

import com.empoderat.model.mysql.Category;
import com.empoderat.model.mysql.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;  // Añade esta importación
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    List<Course> findByCategory(Category category);
    List<Course> findByNameContainingIgnoreCase(String name);

    // Añade estas consultas al repositorio existente

    @Query("SELECT COUNT(e) FROM Enrollment e")
    int countTotalEnrollments();

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.enrollmentDate > :since")
    int countEnrollmentsAfter(@Param("since") LocalDateTime since);

    @Query("SELECT c.name, COUNT(e) FROM Enrollment e JOIN e.course c GROUP BY c.name")
    List<Object[]> countEnrollmentsGroupByCourse();

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.enrollmentDate BETWEEN :start AND :end")
    int countEnrollmentsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.completed = true")
    int countCompletedCourses();

    @Query("SELECT c.category.name, COUNT(e) FROM Enrollment e JOIN e.course c WHERE e.completed = true GROUP BY c.category.name")
    List<Object[]> countCompletedCoursesGroupByCategory();

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.completed = true AND e.completionDate BETWEEN :start AND :end")
    int countCoursesCompletedBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT c.category.name, COUNT(e) FROM Enrollment e JOIN e.course c GROUP BY c.category.name")
    List<Object[]> countEnrollmentsGroupByCategory();

    @Query("SELECT COUNT(e) FROM Enrollment e JOIN e.course c WHERE c.category.name = :categoryName AND e.enrollmentDate BETWEEN :start AND :end")
    int countEnrollmentsByCategoryBetween(@Param("categoryName") String categoryName, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}