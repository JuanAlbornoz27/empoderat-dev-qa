package com.empoderat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Clase principal que inicia la aplicación Spring Boot.
 * Esta clase sirve como punto de entrada para la aplicación Empoderat.
 * 
 * La anotación @SpringBootApplication combina:
 * - @Configuration: Marca la clase como fuente de definiciones de beans
 * - @EnableAutoConfiguration: Habilita la autoconfiguración de Spring Boot
 * - @ComponentScan: Habilita el escaneo de componentes en el paquete actual y subpaquetes
 */
@SpringBootApplication
@EnableJpaAuditing // Habilita auditoría para entidades JPA (created_at, updated_at, etc.)
public class EmpoderatApplication {

    /**
     * Método principal que inicia la aplicación Spring Boot.
     * 
     * @param args Argumentos de línea de comandos pasados al iniciar la aplicación
     */
    public static void main(String[] args) {
        SpringApplication.run(EmpoderatApplication.class, args);
    }
    
    // Aquí puedes agregar beans adicionales si los necesitas
    
    /*
    @Bean
    public CommandLineRunner demoData(UserRepository userRepository) {
        return args -> {
            // Código para inicializar datos de prueba si es necesario
        };
    }
    */
}