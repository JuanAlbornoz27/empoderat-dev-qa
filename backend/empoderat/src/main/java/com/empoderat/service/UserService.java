package com.empoderat.service;

import com.empoderat.dto.user.UserProfileRequest;
import com.empoderat.dto.user.UserProfileResponse;
import com.empoderat.model.mysql.User;
import com.empoderat.repository.mysql.UserRepository;
import com.empoderat.util.FileUploadUtil;
import com.empoderat.util.SecurityUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final FileUploadUtil fileUploadUtil;
    private final SecurityUtil securityUtil;

    public UserProfileResponse getCurrentUserProfile() {
        User user = getCurrentUser();
        return mapUserToProfileResponse(user);
    }
    
    // Método para obtener perfil por email
    public UserProfileResponse getUserProfileByEmail(String email) {
        log.info("Buscando usuario por email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("Usuario no encontrado con email: {}", email);
                    return new EntityNotFoundException("Usuario no encontrado con email: " + email);
                });
        log.info("Usuario encontrado: {}", user.getId());
        return mapUserToProfileResponse(user);
    }

    public UserProfileResponse updateUserProfile(UserProfileRequest request) {
        User user = getCurrentUser();

        // Actualizar campos solo si vienen en la solicitud
        if (request.getFirstName() != null && !request.getFirstName().isEmpty()) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null && !request.getLastName().isEmpty()) {
            user.setLastName(request.getLastName());
        }

        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            user.setPhone(request.getPhone());
        }

        if (request.getCity() != null && !request.getCity().isEmpty()) {
            user.setCity(request.getCity());
        }

        if (request.getBirthDate() != null && !request.getBirthDate().isEmpty()) {
            try {
                user.setBirthDate(LocalDate.parse(request.getBirthDate()));
            } catch (Exception e) {
                log.error("Error parsing date: {}", request.getBirthDate(), e);
            }
        }

        User savedUser = userRepository.save(user);
        return mapUserToProfileResponse(savedUser);
    }

    public UserProfileResponse updateProfileImage(MultipartFile image) {
        if (image.isEmpty()) {
            throw new IllegalArgumentException("La imagen no puede estar vacía");
        }

        User user = getCurrentUser();

        // Generar nombre de archivo único
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();

        // Guardar la imagen y obtener la URL
        String imageUrl = fileUploadUtil.saveImage(image, "profile-images", fileName);

        // Actualizar la URL en el usuario
        user.setImageUrl(imageUrl);
        User savedUser = userRepository.save(user);

        return mapUserToProfileResponse(savedUser);
    }

    private User getCurrentUser() {
        String userEmail = securityUtil.getCurrentUserEmail();
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
    }

    private UserProfileResponse mapUserToProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .documentNumber(user.getIdentificationNumber())
                .phone(user.getPhone())
                .birthDate(user.getBirthDate() != null ? user.getBirthDate().toString() : null)
                .city(user.getCity())
                .imageUrl(user.getImageUrl())
                .build();
    }
}