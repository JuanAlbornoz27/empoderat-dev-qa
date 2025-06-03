package com.empoderat.model.mysql;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @Column(name = "last_activity")
    private LocalDateTime lastActivity;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Relación muchos a muchos con Cursos
    @ManyToMany
    @JoinTable(name = "user_courses", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Set<Course> enrolledCourses = new HashSet<>();

    // Relación muchos a muchos con Módulos
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_modules", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "module_id"))
    private List<Module> completedModules = new ArrayList<>();

    // Añade un método para actualizar la última actividad
    public void updateLastActivity() {
        this.lastActivity = LocalDateTime.now();
    }

    // Añade este método para establecer los valores por defecto al crear un usuario
    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (lastActivity == null) {
            lastActivity = LocalDateTime.now();
        }
    }

    // Añade este método para actualizar lastActivity cuando se modifica un usuario
    @PreUpdate
    public void preUpdate() {
        lastActivity = LocalDateTime.now();
    }

    // Añade estos getters y setters
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(LocalDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }
}