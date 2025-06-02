package com.empoderat.config.datasource;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.empoderat.repository.mongodb")
@Profile("dev")
public class MongoDevConfig {
    // No hace falta añadir nada más aquí.
    // Esta clase solo “activa” @EnableMongoRepositories
    // cuando el perfil activo es “dev”.
}
