package com.empoderat.model.neo4j;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.LocalDateTime;

@Node("UserProgress")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {
    
    @Id
    @GeneratedValue
    private Long id;
    
    @Property("userId")
    private Long userId;
    
    @Property("courseId")
    private Long courseId;
    
    @Property("progress")
    private Integer progress;
    
    @Property("lastAccess")
    private LocalDateTime lastAccess;
    
    @Property("completed")
    private Boolean completed;
    
    @Relationship(type = "ENROLLED_IN")
    private CourseNode courseNode;
    
    @Node("Course")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseNode {
        @Id
        private Long courseId;
        private String title;
    }
}