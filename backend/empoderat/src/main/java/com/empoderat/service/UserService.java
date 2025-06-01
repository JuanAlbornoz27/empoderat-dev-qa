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
        try {
            // Verificar si tenemos email en la solicitud
            String email;
            if (request.getEmail() != null && !request.getEmail().isEmpty()) {
                email = request.getEmail();
                log.info("Usando email de la solicitud: {}", email);
            } else {
                // Si no hay email en la solicitud, usar el del token
                email = securityUtil.getCurrentUserEmail();
                log.info("Usando email del token: {}", email);
            }
            
            // Buscar el usuario por email
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        log.error("Usuario no encontrado con email: {}", email);
                        return new EntityNotFoundException("Usuario no encontrado con email: " + email);
                    });
            
            log.info("Usuario encontrado con ID: {}", user.getId());
            
            // Actualizar campos
            if (request.getFirstName() != null && !request.getFirstName().isEmpty()) {
                user.setFirstName(request.getFirstName());
                log.info("Actualizando firstName a: {}", request.getFirstName());
            }

            if (request.getLastName() != null && !request.getLastName().isEmpty()) {
                user.setLastName(request.getLastName());
                log.info("Actualizando lastName a: {}", request.getLastName());
            }

            if (request.getPhone() != null && !request.getPhone().isEmpty()) {
                user.setPhone(request.getPhone());
                log.info("Actualizando phone a: {}", request.getPhone());
            }

            if (request.getCity() != null && !request.getCity().isEmpty()) {
                user.setCity(request.getCity());
                log.info("Actualizando city a: {}", request.getCity());
            }

            if (request.getBirthDate() != null && !request.getBirthDate().isEmpty()) {
                try {
                    // Intentar formatear la fecha en diferentes formatos comunes
                    LocalDate parsedDate = null;
                    try {
                        // Formato ISO (yyyy-MM-dd)
                        parsedDate = LocalDate.parse(request.getBirthDate());
                    } catch (Exception e1) {
                        try {
                            // Formato dd/MM/yyyy
                            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                            parsedDate = LocalDate.parse(request.getBirthDate(), formatter);
                        } catch (Exception e2) {
                            try {
                                // Formato MM/dd/yyyy
                                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
                                parsedDate = LocalDate.parse(request.getBirthDate(), formatter);
                            } catch (Exception e3) {
                                log.error("No se pudo parsear la fecha: {}", request.getBirthDate());
                                throw new IllegalArgumentException("Formato de fecha no válido");
                            }
                        }
                    }
                    
                    if (parsedDate != null) {
                        user.setBirthDate(parsedDate);
                        log.info("Actualizando birthDate a: {}", parsedDate);
                    }
                } catch (Exception e) {
                    log.error("Error parsing date: {}", request.getBirthDate(), e);
                }
            }

            log.info("Guardando cambios en la base de datos");
            User savedUser = userRepository.save(user);
            log.info("Usuario actualizado con éxito");
            
            return mapUserToProfileResponse(savedUser);
        } catch (Exception e) {
            log.error("Error al actualizar perfil: ", e);
            throw e;
        }
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