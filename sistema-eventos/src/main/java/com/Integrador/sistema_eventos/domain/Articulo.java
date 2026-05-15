package com.Integrador.sistema_eventos.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "articulos")
@Getter
@Setter
public class Articulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private int stock_total;

    @Column(nullable = false)
    private int stock_disponible;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false)
    private String estado; // "Disponible", "Mantenimiento"

    @Column(nullable = false)
    private BigDecimal precio;
}