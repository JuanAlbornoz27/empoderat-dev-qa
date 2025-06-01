package com.empoderat.dto.course;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseRequest {
    private String name;
    private String status;
    private String description;
    private Long categoryId;
    private int enrolledCount;
    private int estimatedDuration;
    private String imageUrl;
    private int moduleCount;
}