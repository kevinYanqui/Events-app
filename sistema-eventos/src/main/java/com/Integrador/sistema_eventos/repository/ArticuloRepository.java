package com.Integrador.sistema_eventos.repository;

import com.Integrador.sistema_eventos.domain.Articulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticuloRepository extends JpaRepository<Articulo, Long> {
}