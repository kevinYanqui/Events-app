package com.Integrador.sistema_eventos.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ArticuloDTO {
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private String categoria;
    private int stock_total;
    private int stock_disponible;
    private String estado;
}