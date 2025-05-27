package com.empoderat.dto.auth;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class RegisterRequest {
    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "El apellido es obligatorio")
    private String lastName;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Formato de email inválido")
    private String email;

    @NotBlank(message = "El número de documento es obligatorio")
    private String documentNumber;

    @NotBlank(message = "El teléfono es obligatorio")
    private String phone;

    @NotBlank(message = "La fecha de nacimiento es obligatoria")
    private String birthDate;

    @NotBlank(message = "La ciudad es obligatoria")
    private String city;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;
}