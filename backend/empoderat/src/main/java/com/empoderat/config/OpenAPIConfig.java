package com.empoderat.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de EmpoderaT")
                        .version("1.0.0")
                        .description("API RESTful para la plataforma de educación EmpoderaT")
                        .contact(new Contact()
                                .name("Equipo EmpoderaT")
                                .email("contacto@empoderat.com")
                                .url("https://www.empoderat.com")))
                .addSecurityItem(new SecurityRequirement().addList("jwt"))
                .components(new Components()
                        .addSecuritySchemes("jwt", 
                                new SecurityScheme()
                                        .name("jwt")
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .in(SecurityScheme.In.HEADER)
                                        .description("Ingrese el token JWT con el prefijo Bearer.")));
    }
}