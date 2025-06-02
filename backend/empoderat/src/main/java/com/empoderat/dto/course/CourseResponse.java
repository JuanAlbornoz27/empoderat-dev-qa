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
    private String status;
    private String description;
    private CategoryDTO category;
    private int enrolledCount;
    private int estimatedDuration;
    private String imageUrl;
    private int moduleCount;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDTO {
        private Long id;
        private String name;
    }

    public static CourseResponse fromEntity(Course course) {
        CategoryDTO categoryDto = null;
        // It's good practice to check if course.getCategory() is null
        // to prevent NullPointerExceptions if a course might not have a category.
        if (course.getCategory() != null) {
            categoryDto = CategoryDTO.builder()
                    .id(course.getCategory().getId())
                    .name(course.getCategory().getName())
                    .build();
        }

        return CourseResponse.builder()
                .id(course.getId())
                .name(course.getName())
                .description(course.getDescription())
                .status(course.getStatus().toString())
                .category(categoryDto) // categoryDto will be null if course has no category
                .enrolledCount(course.getEnrolledCount())
                .estimatedDuration(course.getEstimatedDuration())
                .imageUrl(course.getImageUrl())
                // Ensure modules list isn't null before calling size()
                .moduleCount(course.getModules() != null ? course.getModules().size() : 0)
                .build();
    }
}