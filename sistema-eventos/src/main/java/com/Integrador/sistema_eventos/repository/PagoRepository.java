package com.Integrador.sistema_eventos.repository;

import com.Integrador.sistema_eventos.domain.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {

}