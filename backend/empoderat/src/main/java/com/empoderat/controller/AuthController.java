package com.empoderat.controller;

import com.empoderat.config.security.JwtUtil;
import com.empoderat.dto.auth.AuthRequest;
import com.empoderat.dto.auth.AuthResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Endpoints para autenticación de usuarios")
public class AuthController {

    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario con sus credenciales")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        // En un sistema real, este método validaría las credenciales contra Keycloak
        // Por ahora, simulamos una respuesta exitosa para propósitos de prueba
        
        String token = jwtUtil.generateToken(authRequest.getEmail());
        
        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .userId(1L)
                .name("Usuario de Prueba")
                .role("USER")
                .build());
    }
}