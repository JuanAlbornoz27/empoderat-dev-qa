package com.empoderat.repository.mysql;

import com.empoderat.model.mysql.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByKeycloakId(String keycloakId);

    boolean existsByEmail(String email);

    int countByCreatedAtAfter(LocalDateTime since);

    int countByLastActivityAfter(LocalDateTime since);

    int countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}