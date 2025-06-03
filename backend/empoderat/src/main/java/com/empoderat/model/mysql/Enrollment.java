package com.empoderat.model.mysql;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "enrollment_date", nullable = false)
    private LocalDateTime enrollmentDate;

    @Column(name = "completion_date")
    private LocalDateTime completionDate;

    @Column(name = "progress", nullable = false)
    private Integer progress;

    @Column(name = "completed", nullable = false)
    private Boolean completed;

    @PrePersist
    public void prePersist() {
        enrollmentDate = LocalDateTime.now();
        progress = progress != null ? progress : 0;
        completed = completed != null ? completed : false;
    }
}