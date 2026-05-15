package com.Integrador.sistema_eventos.repository;

import com.Integrador.sistema_eventos.domain.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    @Query("SELECT r FROM Reserva r WHERE r.fecha_evento BETWEEN ?1 AND ?2")
    List<Reserva> findByFechaEventoBetween(LocalDate startDate, LocalDate endDate);
}