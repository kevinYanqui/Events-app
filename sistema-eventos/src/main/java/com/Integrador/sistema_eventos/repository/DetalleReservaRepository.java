package com.Integrador.sistema_eventos.repository;

import com.Integrador.sistema_eventos.domain.DetalleReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DetalleReservaRepository extends JpaRepository<DetalleReserva, Long> {
    @Query("SELECT dr FROM DetalleReserva dr WHERE dr.reserva.fecha_evento BETWEEN ?1 AND ?2")
    List<DetalleReserva> findByReservaFechaEventoBetween(LocalDate startDate, LocalDate endDate);
}