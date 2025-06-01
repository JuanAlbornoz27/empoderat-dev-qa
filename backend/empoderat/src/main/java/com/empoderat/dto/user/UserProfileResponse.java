package com.empoderat.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {
    private Long id;
    private String name;
    private String lastName;
    private String email;
    private String documentNumber;
    private String phone;
    private String birthDate;
    private String city;
    private String imageUrl;
}