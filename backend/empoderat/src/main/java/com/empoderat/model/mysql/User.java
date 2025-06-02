package com.empoderat.model.mysql;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "identification_number", unique = true)
    private String identificationNumber;

    @Column(length = 20)
    private String phone;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(length = 50)
    private String city;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "keycloak_id", nullable = false, unique = true)
    private String keycloakId;

    // Relación muchos a muchos con Cursos
    @ManyToMany
    @JoinTable(name = "user_courses", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Set<Course> enrolledCourses = new HashSet<>();

    // Relación muchos a muchos con Módulos
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_modules", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "module_id"))
    private List<Module> completedModules = new ArrayList<>();
}