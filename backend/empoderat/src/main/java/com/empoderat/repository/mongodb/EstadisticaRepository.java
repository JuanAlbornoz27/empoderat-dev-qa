package com.empoderat.repository.mongodb;

import com.empoderat.model.mongodb.Estadistica;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface EstadisticaRepository extends MongoRepository<Estadistica, String> {

    List<Estadistica> findByTipo(String tipo);

    List<Estadistica> findByPeriodo(String periodo);

    @Query("{'fecha': {$gte: ?0, $lte: ?1}}")
    List<Estadistica> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Estadistica> findByTipoAndPeriodo(String tipo, String periodo);
}