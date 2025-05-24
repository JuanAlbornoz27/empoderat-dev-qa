package main.java.com.empoderat.dto.auth;

import com.empoderat.model.mysql.Course;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String imageUrl;
    private int moduleCount;
    
    public static CourseResponse fromEntity(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .category(course.getCategory().toString())
                .imageUrl(course.getImageUrl())
                .build();
    }
}