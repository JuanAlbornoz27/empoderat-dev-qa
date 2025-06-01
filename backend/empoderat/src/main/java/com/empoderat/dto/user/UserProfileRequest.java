package com.empoderat.dto.user;

import lombok.Data;

@Data
public class UserProfileRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String birthDate; // Formato YYYY-MM-DD
    private String city;
}