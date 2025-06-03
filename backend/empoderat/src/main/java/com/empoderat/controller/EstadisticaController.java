package com.empoderat.controller;

import com.empoderat.model.mongodb.Estadistica;
import com.empoderat.service.EstadisticaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estadisticas")
@Tag(name = "Estadísticas", description = "Endpoints para gestión de estadísticas")
public class EstadisticaController {

    @Autowired
    private EstadisticaService estadisticaService;
    
    @GetMapping("/{tipo}")
    @Operation(
        summary = "Obtener estadísticas por tipo y periodo",
        description = "Devuelve las estadísticas del tipo y periodo especificados",
        security = @SecurityRequirement(name = "jwt")
    )
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas(
            @PathVariable String tipo,
            @RequestParam(defaultValue = "diario") String periodo) {
        
        // Obtener estadísticas del servicio
        List<Estadistica> estadisticas = estadisticaService.obtenerEstadisticasPorTipoYPeriodo(tipo, periodo);
        
        // Mapa final de respuesta
        Map<String, Object> respuesta = new HashMap<>();
        
        // Si no hay estadísticas, devolver estructura por defecto
        if (estadisticas.isEmpty()) {
            return ResponseEntity.ok(generarEstructuraPorDefecto(tipo));
        }

        // Obtener la estadística más reciente
        Estadistica estadisticaReciente = estadisticas.stream()
                .sorted((e1, e2) -> e2.getFecha().compareTo(e1.getFecha()))
                .findFirst()
                .orElse(null);
        
        if (estadisticaReciente != null && estadisticaReciente.getDatos() != null) {
            // Transformar la estructura de datos según lo que espera el frontend
            respuesta = transformarDatosParaFrontend(estadisticaReciente, tipo);
        } else {
            respuesta = generarEstructuraPorDefecto(tipo);
        }
        
        return ResponseEntity.ok(respuesta);
    }
    
    @GetMapping("/rango")
    @Operation(
        summary = "Obtener estadísticas por rango de fechas",
        description = "Devuelve las estadísticas generadas en un rango de fechas",
        security = @SecurityRequirement(name = "jwt")
    )
    public ResponseEntity<List<Estadistica>> obtenerPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(estadisticaService.obtenerEstadisticasPorRangoFechas(inicio, fin));
    }
    
    @GetMapping("/dashboard")
    @Operation(
        summary = "Obtener resumen para dashboard",
        description = "Devuelve un resumen de las principales estadísticas para el dashboard",
        security = @SecurityRequirement(name = "jwt")
    )
    public ResponseEntity<Map<String, Object>> obtenerResumenDashboard() {
        Map<String, Object> resumen = new HashMap<>();
        
        // Obtener estadísticas más recientes de cada tipo
        List<Estadistica> estadisticasUsuarios = estadisticaService.obtenerEstadisticasPorTipoYPeriodo("usuarios", "diario");
        List<Estadistica> estadisticasInscripciones = estadisticaService.obtenerEstadisticasPorTipoYPeriodo("inscripciones", "diario");
        List<Estadistica> estadisticasCursos = estadisticaService.obtenerEstadisticasPorTipoYPeriodo("cursos", "diario");
        List<Estadistica> estadisticasCategorias = estadisticaService.obtenerEstadisticasPorTipoYPeriodo("categorias", "diario");
        
        // Extraer datos para el dashboard
        if (!estadisticasUsuarios.isEmpty()) {
            Map<String, Object> datosUsuarios = estadisticasUsuarios.get(0).getDatos();
            resumen.put("totalUsuarios", datosUsuarios.getOrDefault("totalUsuarios", 0));
            resumen.put("nuevosUsuarios", datosUsuarios.getOrDefault("nuevosUsuarios", 0));
            resumen.put("usuariosActivos", datosUsuarios.getOrDefault("usuariosActivos", 0));
        }
        
        if (!estadisticasInscripciones.isEmpty()) {
            Map<String, Object> datosInscripciones = estadisticasInscripciones.get(0).getDatos();
            resumen.put("totalInscripciones", datosInscripciones.getOrDefault("totalInscripciones", 0));
            resumen.put("nuevasInscripciones", datosInscripciones.getOrDefault("nuevasInscripciones", 0));
        }
        
        if (!estadisticasCursos.isEmpty()) {
            Map<String, Object> datosCursos = estadisticasCursos.get(0).getDatos();
            resumen.put("cursosCompletados", datosCursos.getOrDefault("totalCursosCompletados", 0));
        }
        
        if (!estadisticasCategorias.isEmpty()) {
            Map<String, Object> datosCategorias = estadisticasCategorias.get(0).getDatos();
            resumen.put("inscripcionesPorCategoria", datosCategorias.getOrDefault("inscripcionesPorCategoria", new HashMap<>()));
        }
        
        return ResponseEntity.ok(resumen);
    }
    
    @PostMapping("/generar/{periodo}")
    @Operation(
        summary = "Generar estadísticas para un periodo",
        description = "Genera todas las estadísticas para el periodo especificado",
        security = @SecurityRequirement(name = "jwt")
    )
    public ResponseEntity<String> generarEstadisticas(@PathVariable String periodo) {
        switch (periodo) {
            case "diario":
                estadisticaService.generarEstadisticasDiarias();
                break;
            case "semanal":
                estadisticaService.generarEstadisticasSemanales();
                break;
            case "mensual":
                estadisticaService.generarEstadisticasMensuales();
                break;
            default:
                return ResponseEntity.badRequest().body("Periodo no válido");
        }
        
        return ResponseEntity.ok("Estadísticas generadas correctamente");
    }

    // Método para transformar datos al formato esperado por el frontend
    private Map<String, Object> transformarDatosParaFrontend(Estadistica estadistica, String tipo) {
        Map<String, Object> resultado = new HashMap<>();
        Map<String, Object> datos = estadistica.getDatos();
        
        // Copiar datos principales al nivel superior
        switch (tipo) {
            case "usuarios":
                resultado.put("totalUsuarios", datos.getOrDefault("totalUsuarios", 0));
                resultado.put("nuevosUsuarios", datos.getOrDefault("nuevosUsuarios", 0));
                resultado.put("usuariosActivos", datos.getOrDefault("usuariosActivos", 0));
                break;
            case "inscripciones":
                resultado.put("totalInscripciones", datos.getOrDefault("totalInscripciones", 0));
                resultado.put("nuevasInscripciones", datos.getOrDefault("nuevasInscripciones", 0));
                resultado.put("inscripcionesPorCurso", datos.getOrDefault("inscripcionesPorCurso", new HashMap<>()));
                break;
            case "cursos":
                resultado.put("totalCursosCompletados", datos.getOrDefault("totalCursosCompletados", 0));
                resultado.put("tasaComplecion", datos.getOrDefault("tasaComplecion", 0));
                resultado.put("completadosPorCategoria", datos.getOrDefault("completadosPorCategoria", new HashMap<>()));
                break;
            case "categorias":
                resultado.put("inscripcionesPorCategoria", datos.getOrDefault("inscripcionesPorCategoria", new HashMap<>()));
                resultado.put("tasaCompletadoPorCategoria", datos.getOrDefault("tasaCompletadoPorCategoria", new HashMap<>()));
                break;
        }
        
        // Manejar el histórico - generar estructura para gráficos de línea si no existe
        Object historico = datos.get("historico");
        if (historico != null) {
            if (historico instanceof Map) {
                // Si ya es un mapa con formato de fechas -> valores, usarlo directamente
                if (((Map<?, ?>) historico).keySet().stream().anyMatch(k -> k instanceof String && ((String) k).contains("-"))) {
                    resultado.put("historico", historico);
                } else {
                    // Convertir el formato actual a formato con fechas
                    Map<String, Object> nuevoHistorico = new HashMap<>();
                    LocalDate hoy = LocalDate.now();
                    // Alternativa con casting específico:
                    nuevoHistorico.put(hoy.toString(), ((Map<String, Object>) historico).get("nuevosUsuarios") != null ? 
                  ((Number)((Map<String, Object>) historico).get("nuevosUsuarios")).intValue() : 0);
                    resultado.put("historico", nuevoHistorico);
                }
            } else {
                // Formato desconocido, crear histórico por defecto
                Map<String, Integer> historicoDefault = new HashMap<>();
                LocalDate fecha = LocalDate.now();
                historicoDefault.put(fecha.toString(), 0);
                resultado.put("historico", historicoDefault);
            }
        } else {
            // No hay histórico, crear uno vacío
            resultado.put("historico", new HashMap<>());
        }
        
        return resultado;
    }

    // Método para generar estructura por defecto según tipo
    private Map<String, Object> generarEstructuraPorDefecto(String tipo) {
        Map<String, Object> respuesta = new HashMap<>();
        Map<String, Integer> historicoDefault = new HashMap<>();
        LocalDate fecha = LocalDate.now();
        historicoDefault.put(fecha.toString(), 0);
        
        switch (tipo) {
            case "inscripciones":
                respuesta.put("totalInscripciones", 0);
                respuesta.put("nuevasInscripciones", 0);
                respuesta.put("inscripcionesPorCurso", new HashMap<>());
                respuesta.put("historico", historicoDefault);
                break;
            case "usuarios":
                respuesta.put("totalUsuarios", 0);
                respuesta.put("nuevosUsuarios", 0);
                respuesta.put("usuariosActivos", 0);
                respuesta.put("historico", historicoDefault);
                break;
            case "cursos":
                respuesta.put("totalCursosCompletados", 0);
                respuesta.put("tasaComplecion", 0);
                respuesta.put("completadosPorCategoria", new HashMap<>());
                respuesta.put("historico", historicoDefault);
                break;
            case "categorias":
                respuesta.put("inscripcionesPorCategoria", new HashMap<>());
                respuesta.put("tasaCompletadoPorCategoria", new HashMap<>());
                respuesta.put("tendenciaPorCategoria", new HashMap<>());
                break;
        }
        return respuesta;
    }
}