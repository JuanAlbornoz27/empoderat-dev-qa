package com.empoderat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.ws.rs.core.Response;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class KeycloakService {

    @Value("${keycloak.auth-server-url}")
    private String keycloakServerUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.resource}")
    private String clientId;

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;

    private Keycloak getKeycloakInstance() {
        return KeycloakBuilder.builder()
                .serverUrl(keycloakServerUrl)
                .realm("master")
                .clientId("admin-cli")
                .username("admin")
                .password("admin")
                .build();
    }

    public String createUser(String firstName, String lastName, String email,
            String documentNumber, String phone, String city,
            String password, String birthDate) {

        Keycloak keycloak = getKeycloakInstance();
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        // Crear representación del usuario
        UserRepresentation user = new UserRepresentation();
        user.setUsername(email);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEnabled(true);
        user.setEmailVerified(true);

        // Agregar atributos personalizados
        Map<String, List<String>> attributes = new HashMap<>();
        attributes.put("documentNumber", Collections.singletonList(documentNumber));
        attributes.put("phone", Collections.singletonList(phone));
        attributes.put("city", Collections.singletonList(city));
        attributes.put("birthDate", Collections.singletonList(birthDate));
        user.setAttributes(attributes);

        // Crear usuario
        Response response = usersResource.create(user);

        if (response.getStatus() != 201) {
            log.error("Error creating user: {}", response.getStatusInfo());
            throw new RuntimeException("Error al crear usuario en Keycloak");
        }

        // Obtener ID del usuario creado
        String userId = extractUserIdFromResponse(response);

        // Establecer contraseña
        setUserPassword(usersResource.get(userId), password);

        // Asignar rol de APRENDIZ por defecto
        assignRoleToUser(userId, "APRENDIZ");

        log.info("Usuario creado exitosamente en Keycloak: {}", email);
        return userId;
    }

    private String extractUserIdFromResponse(Response response) {
        String location = response.getHeaderString("Location");
        return location.substring(location.lastIndexOf('/') + 1);
    }

    private void setUserPassword(UserResource userResource, String password) {
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);

        userResource.resetPassword(credential);
    }

    public void assignRoleToUser(String userId, String roleName) {
        Keycloak keycloak = getKeycloakInstance();
        RealmResource realmResource = keycloak.realm(realm);

        // Obtener el rol
        RoleRepresentation role = realmResource.roles().get(roleName).toRepresentation();

        // Asignar el rol al usuario
        realmResource.users().get(userId).roles().realmLevel().add(Arrays.asList(role));

        log.info("Rol {} asignado al usuario {}", roleName, userId);
    }

    public void deleteUser(String userId) {
        Keycloak keycloak = getKeycloakInstance();
        RealmResource realmResource = keycloak.realm(realm);

        realmResource.users().get(userId).remove();
        log.info("Usuario eliminado de Keycloak: {}", userId);
    }

    public UserRepresentation getUserByEmail(String email) {
        Keycloak keycloak = getKeycloakInstance();
        RealmResource realmResource = keycloak.realm(realm);

        List<UserRepresentation> users = realmResource.users().search(email, true);
        return users.isEmpty() ? null : users.get(0);
    }

    public void updateUser(String userId, UserRepresentation userRepresentation) {
        try {
            Keycloak keycloak = getKeycloakInstance();
            RealmResource realmResource = keycloak.realm(realm);

            // Actualizar el usuario
            realmResource.users().get(userId).update(userRepresentation);
            log.info("Usuario actualizado en Keycloak con ID: {}", userId);
        } catch (Exception e) {
            log.error("Error al actualizar usuario en Keycloak: ", e);
            throw new RuntimeException("Error al actualizar usuario en Keycloak: " + e.getMessage());
        }
    }

    public void updateUserRole(String userId, String newRole) {
        Keycloak keycloak = getKeycloakInstance();
        RealmResource realmResource = keycloak.realm(realm);
        UserResource userResource = realmResource.users().get(userId);

        // Remover roles existentes (ADMIN/APRENDIZ)
        List<RoleRepresentation> currentRoles = userResource.roles().realmLevel().listAll();
        currentRoles.stream()
                .filter(role -> role.getName().equals("ADMIN") || role.getName().equals("APRENDIZ"))
                .forEach(role -> userResource.roles().realmLevel().remove(Arrays.asList(role)));

        // Asignar nuevo rol
        assignRoleToUser(userId, newRole);
    }
}