package main.java.com.empoderat.repository.neo4j;

import com.empoderat.model.neo4j.UserProgress;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends Neo4jRepository<UserProgress, Long> {
    
    Optional<UserProgress> findByUserIdAndCourseId(Long userId, Long courseId);
    
    List<UserProgress> findByUserId(Long userId);
    
    @Query("MATCH (u:UserProgress {userId: $userId}) " +
           "RETURN u, [(u)-[r:ENROLLED_IN]->(c:Course) | c] as courseNode")
    List<UserProgress> findAllCoursesForUser(@Param("userId") Long userId);
    
    @Query("MATCH (u:UserProgress {userId: $userId, courseId: $courseId}) SET u.progress = $progress RETURN u")
    UserProgress updateProgress(@Param("userId") Long userId, 
                               @Param("courseId") Long courseId,
                               @Param("progress") Integer progress);
}