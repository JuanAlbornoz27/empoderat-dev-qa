package com.empoderat.controller;

import com.empoderat.dto.user.UserProfileRequest;
import com.empoderat.dto.user.UserProfileResponse;
import com.empoderat.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Usuarios", description = "Endpoints para gestión de perfiles de usuario")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Obtener perfil de usuario", description = "Devuelve los datos del perfil del usuario autenticado", security = @SecurityRequirement(name = "jwt"))
    public ResponseEntity<UserProfileResponse> getUserProfile() {
        UserProfileResponse userProfile = userService.getCurrentUserProfile();
        return ResponseEntity.ok(userProfile);
    }

    @PutMapping("/profile")
    @Operation(summary = "Actualizar perfil de usuario", description = "Actualiza los datos del perfil del usuario autenticado", security = @SecurityRequirement(name = "jwt"))
    public ResponseEntity<UserProfileResponse> updateUserProfile(@RequestBody UserProfileRequest userProfileRequest) {
        UserProfileResponse updatedProfile = userService.updateUserProfile(userProfileRequest);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping("/profile/image")
    @Operation(summary = "Subir imagen de perfil", description = "Sube una nueva imagen de perfil para el usuario", security = @SecurityRequirement(name = "jwt"))
    public ResponseEntity<UserProfileResponse> uploadProfileImage(@RequestParam("image") MultipartFile image) {
        UserProfileResponse updatedProfile = userService.updateProfileImage(image);
        return ResponseEntity.ok(updatedProfile);
    }
}