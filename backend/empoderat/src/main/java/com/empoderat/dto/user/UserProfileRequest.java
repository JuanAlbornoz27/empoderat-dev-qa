package com.empoderat.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String birthDate; // Acepta varios formatos: yyyy-MM-dd, dd/MM/yyyy, etc.
    private String city;
    private String email; // Añadido para identificar al usuario
}