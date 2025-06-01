package com.empoderat.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Component
public class FileUploadUtil {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.base.url:http://localhost:8080}")
    private String baseUrl;

    public String saveImage(MultipartFile file, String subDirectory, String fileName) {
        try {
            Path uploadPath = Paths.get(uploadDir, subDirectory);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Generar URL relativa para acceder a la imagen
            return String.format("%s/%s/%s/%s", baseUrl, uploadDir, subDirectory, fileName);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo guardar el archivo: " + fileName, e);
        }
    }
}