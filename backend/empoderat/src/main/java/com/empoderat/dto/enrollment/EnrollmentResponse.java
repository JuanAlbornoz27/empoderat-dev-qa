package com.empoderat.dto.enrollment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponse {
    private Long id;
    private Long userId;
    private Long courseId;
    private String courseName;
    private LocalDateTime enrollmentDate;
    private Integer progress;
    private Boolean completed;
}