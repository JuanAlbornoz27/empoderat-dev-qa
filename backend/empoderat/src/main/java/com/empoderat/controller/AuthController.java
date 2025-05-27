package com.empoderat.controller;

import com.empoderat.dto.auth.AuthRequest;
import com.empoderat.dto.auth.AuthResponse;
import com.empoderat.dto.auth.RegisterRequest;
import com.empoderat.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Autenticación", description = "Endpoints para autenticación de usuarios")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario con sus credenciales")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            AuthResponse response = authService.login(authRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error en login: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.builder()
                            .tokenType("error")
                            .build());
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar usuario", description = "Registra un nuevo usuario en el sistema")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            String userId = authService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Usuario registrado exitosamente con ID: " + userId);
        } catch (Exception e) {
            log.error("Error en registro: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al registrar usuario: " + e.getMessage());
        }
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refrescar token", description = "Obtiene un nuevo access token usando el refresh token")
    public ResponseEntity<AuthResponse> refresh(@RequestParam String refreshToken) {
        try {
            AuthResponse response = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error al refrescar token: ", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(AuthResponse.builder()
                            .tokenType("error")
                            .build());
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "Cerrar sesión", description = "Invalida el token del usuario")
    public ResponseEntity<String> logout(@RequestParam String refreshToken) {
        try {
            authService.logout(refreshToken);
            return ResponseEntity.ok("Sesión cerrada exitosamente");
        } catch (Exception e) {
            log.error("Error al cerrar sesión: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al cerrar sesión");
        }
    }
}