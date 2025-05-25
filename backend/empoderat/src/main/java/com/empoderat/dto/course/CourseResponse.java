package com.empoderat.dto.course;

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
    private String name;
    private String description;
    private String category;
    private String imageUrl;
    private int moduleCount;

    public static CourseResponse fromEntity(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .name(course.getName())
                .description(course.getDescription())
                .category(course.getCategory() != null ? course.getCategory().getName() : null)
                .imageUrl(course.getImageUrl())
                .moduleCount(course.getModules() != null ? course.getModules().size() : 0)
                .build();
    }
}