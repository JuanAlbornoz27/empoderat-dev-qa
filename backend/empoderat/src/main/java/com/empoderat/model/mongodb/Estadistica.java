package com.empoderat.model.mongodb;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "estadisticas")
public class Estadistica {

    @Id
    private String id;

    private String tipo; // "inscripciones", "usuarios", "cursos", "categorias"
    private LocalDateTime fecha;
    private Map<String, Object> datos; // Estructura flexible para diferentes tipos de datos
    private String periodo; // "diario", "semanal", "mensual"

    // Constructores, getters y setters
    public Estadistica() {
        this.fecha = LocalDateTime.now();
    }

    // Getters y setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public Map<String, Object> getDatos() {
        return datos;
    }

    public void setDatos(Map<String, Object> datos) {
        this.datos = datos;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }
}