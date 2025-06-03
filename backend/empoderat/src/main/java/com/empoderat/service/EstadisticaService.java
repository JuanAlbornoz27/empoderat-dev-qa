package com.empoderat.service;

import com.empoderat.model.mongodb.Estadistica;
import com.empoderat.repository.mongodb.EstadisticaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class EstadisticaService {

    @Autowired
    private EstadisticaRepository estadisticaRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UserService userService; // Servicio existente para usuarios

    @Autowired
    private CourseService courseService; // Servicio existente para cursos

    // 1. Métodos para generar estadísticas (ejecutados por un job programado)

    public void generarEstadisticasDiarias() {
        log.info("Generando estadísticas diarias");
        // Generar todas las estadísticas diarias
        generarEstadisticasUsuarios("diario");
        generarEstadisticasInscripciones("diario");
        generarEstadisticasCursosCompletados("diario");
        generarEstadisticasCategoriasPorPopularidad("diario");
        log.info("Estadísticas diarias generadas correctamente");
    }

    public void generarEstadisticasSemanales() {
        log.info("Generando estadísticas semanales");
        // Generar todas las estadísticas semanales
        generarEstadisticasUsuarios("semanal");
        generarEstadisticasInscripciones("semanal");
        generarEstadisticasCursosCompletados("semanal");
        generarEstadisticasCategoriasPorPopularidad("semanal");
        log.info("Estadísticas semanales generadas correctamente");
    }

    public void generarEstadisticasMensuales() {
        log.info("Generando estadísticas mensuales");
        // Generar todas las estadísticas mensuales
        generarEstadisticasUsuarios("mensual");
        generarEstadisticasInscripciones("mensual");
        generarEstadisticasCursosCompletados("mensual");
        generarEstadisticasCategoriasPorPopularidad("mensual");
        log.info("Estadísticas mensuales generadas correctamente");
    }

    // 2. Métodos específicos para cada tipo de estadística

    private void generarEstadisticasUsuarios(String periodo) {
        log.debug("Generando estadísticas de usuarios para periodo: {}", periodo);
        
        Estadistica estadistica = new Estadistica();
        estadistica.setTipo("usuarios");
        estadistica.setPeriodo(periodo);
        estadistica.setFecha(LocalDateTime.now());

        try {
            // Obtener datos reales del sistema
            int totalUsuarios = userService.countAllUsers();
            int nuevosUsuariosHoy = userService.countNewUsersSince(LocalDateTime.now().minusDays(1));
            int usuariosActivos = userService.countActiveUsersSince(LocalDateTime.now().minusDays(7));

            Map<String, Object> datos = new HashMap<>();
            datos.put("totalUsuarios", totalUsuarios);
            datos.put("nuevosUsuarios", nuevosUsuariosHoy);
            datos.put("usuariosActivos", usuariosActivos);

            // Añadir datos históricos para gráficos de línea
            Map<String, Integer> historico = new LinkedHashMap<>();
            // Para últimos 7 días si es diario, últimas 4 semanas si es semanal, etc.
            LocalDateTime startDate = getStartDateByPeriod(periodo);
            while (startDate.isBefore(LocalDateTime.now())) {
                String key = startDate.toLocalDate().toString();
                int usuarios = userService.countUsersSince(startDate, incrementDateByPeriod(startDate, periodo));
                historico.put(key, usuarios);
                startDate = incrementDateByPeriod(startDate, periodo);
            }
            datos.put("historico", historico);

            estadistica.setDatos(datos);
            estadisticaRepository.save(estadistica);
            log.debug("Estadísticas de usuarios guardadas correctamente para periodo: {}", periodo);
        } catch (Exception e) {
            log.error("Error al generar estadísticas de usuarios: {}", e.getMessage(), e);
        }
    }

    private void generarEstadisticasInscripciones(String periodo) {
        log.debug("Generando estadísticas de inscripciones para periodo: {}", periodo);
        
        Estadistica estadistica = new Estadistica();
        estadistica.setTipo("inscripciones");
        estadistica.setPeriodo(periodo);
        estadistica.setFecha(LocalDateTime.now());

        try {
            // Obtener datos de inscripciones
            int totalInscripciones = courseService.countAllEnrollments();
            int nuevasInscripciones = courseService.countNewEnrollmentsSince(LocalDateTime.now().minusDays(1));
            double promedioInscripcionesPorCurso = courseService.getAverageEnrollmentsPerCourse();

            // Obtener distribución por curso (para gráficos de torta)
            Map<String, Integer> inscripcionesPorCurso = courseService.getEnrollmentCountByCourse();

            Map<String, Object> datos = new HashMap<>();
            datos.put("totalInscripciones", totalInscripciones);
            datos.put("nuevasInscripciones", nuevasInscripciones);
            datos.put("promedioInscripcionesPorCurso", promedioInscripcionesPorCurso);
            datos.put("inscripcionesPorCurso", inscripcionesPorCurso);

            // Añadir histórico para gráficos de línea
            Map<String, Integer> historico = new LinkedHashMap<>();
            LocalDateTime startDate = getStartDateByPeriod(periodo);
            while (startDate.isBefore(LocalDateTime.now())) {
                String key = startDate.toLocalDate().toString();
                int inscripciones = courseService.countEnrollmentsBetween(startDate,
                        incrementDateByPeriod(startDate, periodo));
                historico.put(key, inscripciones);
                startDate = incrementDateByPeriod(startDate, periodo);
            }
            datos.put("historico", historico);

            estadistica.setDatos(datos);
            estadisticaRepository.save(estadistica);
            log.debug("Estadísticas de inscripciones guardadas correctamente para periodo: {}", periodo);
        } catch (Exception e) {
            log.error("Error al generar estadísticas de inscripciones: {}", e.getMessage(), e);
        }
    }

    private void generarEstadisticasCursosCompletados(String periodo) {
        log.debug("Generando estadísticas de cursos completados para periodo: {}", periodo);
        
        Estadistica estadistica = new Estadistica();
        estadistica.setTipo("cursos");
        estadistica.setPeriodo(periodo);
        estadistica.setFecha(LocalDateTime.now());

        try {
            // Obtener datos de cursos completados
            int totalCursosCompletados = courseService.countCompletedCourses();
            double tasaComplecion = courseService.getCompletionRate();
            Map<String, Integer> completadosPorCategoria = courseService.getCompletedCoursesByCategory();

            Map<String, Object> datos = new HashMap<>();
            datos.put("totalCursosCompletados", totalCursosCompletados);
            datos.put("tasaComplecion", tasaComplecion);
            datos.put("completadosPorCategoria", completadosPorCategoria);

            // Añadir histórico para gráficos de línea
            Map<String, Integer> historico = new LinkedHashMap<>();
            LocalDateTime startDate = getStartDateByPeriod(periodo);
            while (startDate.isBefore(LocalDateTime.now())) {
                String key = startDate.toLocalDate().toString();
                int completados = courseService.countCoursesCompletedBetween(startDate,
                        incrementDateByPeriod(startDate, periodo));
                historico.put(key, completados);
                startDate = incrementDateByPeriod(startDate, periodo);
            }
            datos.put("historico", historico);

            estadistica.setDatos(datos);
            estadisticaRepository.save(estadistica);
            log.debug("Estadísticas de cursos completados guardadas correctamente para periodo: {}", periodo);
        } catch (Exception e) {
            log.error("Error al generar estadísticas de cursos completados: {}", e.getMessage(), e);
        }
    }

    private void generarEstadisticasCategoriasPorPopularidad(String periodo) {
        log.debug("Generando estadísticas de categorías por popularidad para periodo: {}", periodo);
        
        Estadistica estadistica = new Estadistica();
        estadistica.setTipo("categorias");
        estadistica.setPeriodo(periodo);
        estadistica.setFecha(LocalDateTime.now());

        try {
            // Obtener datos de popularidad de categorías
            Map<String, Integer> inscripcionesPorCategoria = courseService.getEnrollmentCountByCategory();
            Map<String, Double> tasaCompletadoPorCategoria = courseService.getCompletionRateByCategory();

            Map<String, Object> datos = new HashMap<>();
            datos.put("inscripcionesPorCategoria", inscripcionesPorCategoria);
            datos.put("tasaCompletadoPorCategoria", tasaCompletadoPorCategoria);

            // Añadir tendencia temporal para cada categoría
            Map<String, Map<String, Integer>> tendenciaPorCategoria = new HashMap<>();

            // Para cada categoría, obtener su tendencia en el tiempo
            for (String categoria : inscripcionesPorCategoria.keySet()) {
                Map<String, Integer> historico = new LinkedHashMap<>();
                LocalDateTime startDate = getStartDateByPeriod(periodo);
                while (startDate.isBefore(LocalDateTime.now())) {
                    String key = startDate.toLocalDate().toString();
                    int inscritos = courseService.countEnrollmentsByCategoryBetween(
                            categoria, startDate, incrementDateByPeriod(startDate, periodo));
                    historico.put(key, inscritos);
                    startDate = incrementDateByPeriod(startDate, periodo);
                }
                tendenciaPorCategoria.put(categoria, historico);
            }

            datos.put("tendenciaPorCategoria", tendenciaPorCategoria);

            estadistica.setDatos(datos);
            estadisticaRepository.save(estadistica);
            log.debug("Estadísticas de categorías guardadas correctamente para periodo: {}", periodo);
        } catch (Exception e) {
            log.error("Error al generar estadísticas de categorías: {}", e.getMessage(), e);
        }
    }

    // 3. Métodos de consulta para el controlador

    public Map<String, Object> obtenerEstadisticasPorTipo(String tipo, String periodo) {
        log.debug("Obteniendo estadísticas para tipo: {} y periodo: {}", tipo, periodo);
        List<Estadistica> estadisticas = estadisticaRepository.findByTipoAndPeriodo(tipo, periodo);
        if (estadisticas.isEmpty()) {
            log.info("No se encontraron estadísticas para tipo: {} y periodo: {}", tipo, periodo);
            return new HashMap<>();
        }

        // Devolver los datos de la estadística más reciente
        return estadisticas.stream()
                .sorted((e1, e2) -> e2.getFecha().compareTo(e1.getFecha()))
                .findFirst()
                .map(Estadistica::getDatos)
                .orElse(new HashMap<>());
    }

    public List<Estadistica> obtenerEstadisticasPorTipoYPeriodo(String tipo, String periodo) {
        log.debug("Obteniendo lista de estadísticas para tipo: {} y periodo: {}", tipo, periodo);
        return estadisticaRepository.findByTipoAndPeriodo(tipo, periodo);
    }

    /**
     * Obtiene estadísticas generadas en un rango de fechas
     * @param inicio Fecha de inicio del rango
     * @param fin Fecha de fin del rango
     * @return Lista de estadísticas generadas en el rango de fechas especificado
     */
    public List<Estadistica> obtenerEstadisticasPorRangoFechas(LocalDateTime inicio, LocalDateTime fin) {
        log.debug("Obteniendo estadísticas entre: {} y {}", inicio, fin);
        // Utiliza el método del repositorio que ya habías definido
        return estadisticaRepository.findByFechaBetween(inicio, fin);
    }

    // 4. Métodos auxiliares

    private LocalDateTime getStartDateByPeriod(String periodo) {
        LocalDateTime now = LocalDateTime.now();
        switch (periodo) {
            case "diario":
                return now.minusDays(7).withHour(0).withMinute(0).withSecond(0);
            case "semanal":
                return now.minusWeeks(4).withHour(0).withMinute(0).withSecond(0);
            case "mensual":
                return now.minusMonths(6).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            default:
                return now.minusMonths(1);
        }
    }

    private LocalDateTime incrementDateByPeriod(LocalDateTime date, String periodo) {
        switch (periodo) {
            case "diario":
                return date.plusDays(1);
            case "semanal":
                return date.plusWeeks(1);
            case "mensual":
                return date.plusMonths(1);
            default:
                return date.plusDays(1);
        }
    }

    // Métodos para actualización en tiempo real

    /**
     * Actualiza las estadísticas de usuarios en tiempo real
     */
    public void actualizarEstadisticasUsuarios() {
        log.info("Actualizando estadísticas de usuarios en tiempo real");
        try {
            generarEstadisticasUsuarios("diario");
            log.info("Estadísticas de usuarios actualizadas correctamente");
        } catch (Exception e) {
            log.error("Error al actualizar estadísticas de usuarios: {}", e.getMessage(), e);
        }
    }

    /**
     * Actualiza las estadísticas de inscripciones en tiempo real
     */
    public void actualizarEstadisticasInscripciones() {
        log.info("Actualizando estadísticas de inscripciones en tiempo real");
        try {
            generarEstadisticasInscripciones("diario");
            log.info("Estadísticas de inscripciones actualizadas correctamente");
        } catch (Exception e) {
            log.error("Error al actualizar estadísticas de inscripciones: {}", e.getMessage(), e);
        }
    }

    /**
     * Actualiza las estadísticas de cursos completados en tiempo real
     */
    public void actualizarEstadisticasCursosCompletados() {
        log.info("Actualizando estadísticas de cursos completados en tiempo real");
        try {
            generarEstadisticasCursosCompletados("diario");
            log.info("Estadísticas de cursos completados actualizadas correctamente");
        } catch (Exception e) {
            log.error("Error al actualizar estadísticas de cursos completados: {}", e.getMessage(), e);
        }
    }

    /**
     * Actualiza las estadísticas de categorías por popularidad en tiempo real
     */
    public void actualizarEstadisticasCategorias() {
        log.info("Actualizando estadísticas de categorías en tiempo real");
        try {
            generarEstadisticasCategoriasPorPopularidad("diario");
            log.info("Estadísticas de categorías actualizadas correctamente");
        } catch (Exception e) {
            log.error("Error al actualizar estadísticas de categorías: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Actualiza todas las estadísticas en tiempo real
     * Método útil para llamar después de eventos importantes o manualmente
     */
    public void actualizarTodasLasEstadisticas() {
        log.info("Actualizando todas las estadísticas en tiempo real");
        try {
            actualizarEstadisticasUsuarios();
            actualizarEstadisticasInscripciones();
            actualizarEstadisticasCursosCompletados();
            actualizarEstadisticasCategorias();
            log.info("Todas las estadísticas actualizadas correctamente");
        } catch (Exception e) {
            log.error("Error al actualizar todas las estadísticas: {}", e.getMessage(), e);
        }
    }
}