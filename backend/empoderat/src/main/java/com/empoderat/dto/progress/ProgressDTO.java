package com.empoderat.dto.progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressDTO {
    private Long userId;
    private Long courseId;
    private String courseTitle;
    private Integer percentage;
    private LocalDateTime lastAccess;
    private Boolean completed;
}