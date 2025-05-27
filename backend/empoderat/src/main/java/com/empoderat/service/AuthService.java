package com.empoderat.service;

import com.empoderat.dto.auth.AuthRequest;
import com.empoderat.dto.auth.AuthResponse;
import com.empoderat.dto.auth.RegisterRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final KeycloakService keycloakService;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${keycloak.auth-server-url}")
    private String keycloakServerUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    private String getTokenUrl() {
        return keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/token";
    }

    private String getLogoutUrl() {
        return keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/logout";
    }

    public AuthResponse login(AuthRequest authRequest) {
        try {
            // Preparar headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBasicAuth(clientId, clientSecret);

            // Preparar body
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "password");
            body.add("username", authRequest.getEmail());
            body.add("password", authRequest.getPassword());

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            // Hacer petición a Keycloak
            ResponseEntity<String> response = restTemplate.postForEntity(
                    getTokenUrl(), request, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode tokenResponse = objectMapper.readTree(response.getBody());

                // Decodificar JWT para obtener información del usuario
                String accessToken = tokenResponse.get("access_token").asText();
                JsonNode userInfo = decodeJWT(accessToken);

                return AuthResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(tokenResponse.get("refresh_token").asText())
                        .tokenType("Bearer")
                        .expiresIn(tokenResponse.get("expires_in").asLong())
                        .userId(userInfo.get("sub").asText())
                        .name(userInfo.get("given_name").asText() + " " + userInfo.get("family_name").asText())
                        .email(userInfo.get("email").asText())
                        .role(extractRoleFromToken(userInfo))
                        .build();
            } else {
                throw new RuntimeException("Credenciales inválidas");
            }
        } catch (Exception e) {
            log.error("Error en login: ", e);
            throw new RuntimeException("Error al autenticar usuario: " + e.getMessage());
        }
    }

    public String register(RegisterRequest registerRequest) {
        try {
            return keycloakService.createUser(
                    registerRequest.getName(),
                    registerRequest.getLastName(),
                    registerRequest.getEmail(),
                    registerRequest.getDocumentNumber(),
                    registerRequest.getPhone(),
                    registerRequest.getCity(),
                    registerRequest.getPassword(),
                    registerRequest.getBirthDate());
        } catch (Exception e) {
            log.error("Error en registro: ", e);
            throw new RuntimeException("Error al registrar usuario: " + e.getMessage());
        }
    }

    public AuthResponse refreshToken(String refreshToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBasicAuth(clientId, clientSecret);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "refresh_token");
            body.add("refresh_token", refreshToken);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    getTokenUrl(), request, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode tokenResponse = objectMapper.readTree(response.getBody());

                String accessToken = tokenResponse.get("access_token").asText();
                JsonNode userInfo = decodeJWT(accessToken);

                return AuthResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(tokenResponse.get("refresh_token").asText())
                        .tokenType("Bearer")
                        .expiresIn(tokenResponse.get("expires_in").asLong())
                        .userId(userInfo.get("sub").asText())
                        .name(userInfo.get("given_name").asText() + " " + userInfo.get("family_name").asText())
                        .email(userInfo.get("email").asText())
                        .role(extractRoleFromToken(userInfo))
                        .build();
            } else {
                throw new RuntimeException("Token de refresh inválido");
            }
        } catch (Exception e) {
            log.error("Error al refrescar token: ", e);
            throw new RuntimeException("Error al refrescar token: " + e.getMessage());
        }
    }

    public void logout(String refreshToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBasicAuth(clientId, clientSecret);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("refresh_token", refreshToken);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            restTemplate.postForEntity(getLogoutUrl(), request, String.class);
        } catch (Exception e) {
            log.error("Error al hacer logout: ", e);
            throw new RuntimeException("Error al cerrar sesión: " + e.getMessage());
        }
    }

    private JsonNode decodeJWT(String token) {
        try {
            String[] tokenParts = token.split("\\.");
            String payload = tokenParts[1];
            byte[] decodedBytes = Base64.getUrlDecoder().decode(payload);
            String decodedPayload = new String(decodedBytes);
            return objectMapper.readTree(decodedPayload);
        } catch (Exception e) {
            log.error("Error decodificando JWT: ", e);
            throw new RuntimeException("Error al decodificar token");
        }
    }

    private String extractRoleFromToken(JsonNode userInfo) {
        try {
            JsonNode realmAccess = userInfo.get("realm_access");
            if (realmAccess != null && realmAccess.get("roles") != null) {
                for (JsonNode role : realmAccess.get("roles")) {
                    String roleName = role.asText();
                    if ("ADMIN".equals(roleName) || "APRENDIZ".equals(roleName)) {
                        return roleName;
                    }
                }
            }
            return "APRENDIZ"; // Rol por defecto
        } catch (Exception e) {
            log.error("Error extrayendo rol: ", e);
            return "APRENDIZ";
        }
    }
}