package com.empoderat.model.mysql;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(length = 2000)
    private String description;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "enrolled_count")
    private Integer enrolledCount;

    @Column(name = "estimated_duration")
    private Integer estimatedDuration;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Module> modules = new ArrayList<>();

    // Relación muchos a muchos con usuarios
    @ManyToMany(mappedBy = "enrolledCourses", fetch = FetchType.LAZY)
    private List<User> enrolledUsers = new ArrayList<>();

    public enum Status {
        ACTIVE, INACTIVE
    }
}