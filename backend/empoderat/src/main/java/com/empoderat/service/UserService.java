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
import java.time.LocalDateTime;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.UUID;
import java.util.List;
import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final FileUploadUtil fileUploadUtil;
    private final SecurityUtil securityUtil;
    private final KeycloakService keycloakService; // Añadir esta inyección

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

            // Guardar los valores actuales para compararlos después
            String oldFirstName = user.getFirstName();
            String oldLastName = user.getLastName();
            String oldPhone = user.getPhone();
            String oldCity = user.getCity();
            LocalDate oldBirthDate = user.getBirthDate();

            // Actualizar campos en MySQL
            boolean userUpdated = false;

            if (request.getFirstName() != null && !request.getFirstName().isEmpty()) {
                user.setFirstName(request.getFirstName());
                log.info("Actualizando firstName a: {}", request.getFirstName());
                userUpdated = true;
            }

            if (request.getLastName() != null && !request.getLastName().isEmpty()) {
                user.setLastName(request.getLastName());
                log.info("Actualizando lastName a: {}", request.getLastName());
                userUpdated = true;
            }

            if (request.getPhone() != null && !request.getPhone().isEmpty()) {
                user.setPhone(request.getPhone());
                log.info("Actualizando phone a: {}", request.getPhone());
                userUpdated = true;
            }

            if (request.getCity() != null && !request.getCity().isEmpty()) {
                user.setCity(request.getCity());
                log.info("Actualizando city a: {}", request.getCity());
                userUpdated = true;
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
                        userUpdated = true;
                    }
                } catch (Exception e) {
                    log.error("Error parsing date: {}", request.getBirthDate(), e);
                }
            }

            // Actualizar en Keycloak si hubo cambios en campos relevantes
            if (userUpdated) {
                try {
                    // Obtener el usuario de Keycloak por email
                    UserRepresentation keycloakUser = keycloakService.getUserByEmail(email);

                    if (keycloakUser != null) {
                        // Actualizar campos en Keycloak
                        boolean keycloakUpdate = false;

                        if (!oldFirstName.equals(user.getFirstName())) {
                            keycloakUser.setFirstName(user.getFirstName());
                            keycloakUpdate = true;
                        }

                        if (!oldLastName.equals(user.getLastName())) {
                            keycloakUser.setLastName(user.getLastName());
                            keycloakUpdate = true;
                        }

                        // Actualizar atributos personalizados
                        Map<String, List<String>> attributes = keycloakUser.getAttributes();
                        if (attributes == null) {
                            attributes = new HashMap<>();
                        }

                        if (!oldPhone.equals(user.getPhone())) {
                            attributes.put("phone", Collections.singletonList(user.getPhone()));
                            keycloakUpdate = true;
                        }

                        if (!oldCity.equals(user.getCity())) {
                            attributes.put("city", Collections.singletonList(user.getCity()));
                            keycloakUpdate = true;
                        }

                        if (oldBirthDate == null || !oldBirthDate.equals(user.getBirthDate())) {
                            attributes.put("birthDate", Collections.singletonList(user.getBirthDate().toString()));
                            keycloakUpdate = true;
                        }

                        if (keycloakUpdate) {
                            keycloakUser.setAttributes(attributes);
                            keycloakService.updateUser(keycloakUser.getId(), keycloakUser);
                            log.info("Usuario actualizado en Keycloak: {}", keycloakUser.getId());
                        }
                    }
                } catch (Exception e) {
                    log.error("Error al actualizar usuario en Keycloak: ", e);
                    // No interrumpimos el flujo si falla la actualización en Keycloak
                }
            }

            log.info("Guardando cambios en la base de datos MySQL");
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

    /**
     * Add commentMore actions
     * Cuenta el número total de usuarios en el sistema
     * 
     * @return Número total de usuarios
     */
    public int countAllUsers() {
        return (int) userRepository.count();
    }

    /**
     * Cuenta los usuarios activos desde una fecha determinada
     * 
     * @param since Fecha desde la que contar usuarios activos
     * @return Número de usuarios que han tenido actividad desde la fecha indicada
     */
    public int countActiveUsersSince(LocalDateTime since) {
        // Solución temporal: asume que la mitad de los usuarios son activos
        return (int) (userRepository.count() * 0.5);
    }

    /**
     * Cuenta los nuevos usuarios desde una fecha determinada
     * 
     * @param since Fecha desde la que contar nuevos usuarios
     * @return Número de nuevos usuarios desde la fecha indicada
     */
    public int countNewUsersSince(LocalDateTime since) {
        // Solución temporal: devuelve un valor aproximado o un porcentaje del total
        return (int) (userRepository.count() * 0.1); // Asume 10% de usuarios nuevos
    }

    /**
     * Cuenta los usuarios en un rango de fechas
     * 
     * @param start Fecha de inicio del rango
     * @param end   Fecha de fin del rango
     * @return Número de usuarios en el rango de fechas indicado
     */
    public int countUsersSince(LocalDateTime start, LocalDateTime end) {
        // Solución temporal
        return (int) (userRepository.count() * 0.05); // Asume 5% de usuarios en ese rango
    }
}