package com.Integrador.sistema_eventos.dto;

import com.Integrador.sistema_eventos.domain.Articulo;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ArticuloResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String categoria;
    private BigDecimal precio;
    private int stock_total;
    private int stock_disponible;
    private String estado;

    public ArticuloResponseDTO(Articulo articulo) {
        this.id = articulo.getId();
        this.nombre = articulo.getNombre();
        this.descripcion = articulo.getDescripcion();
        this.categoria = articulo.getCategoria();
        this.precio = articulo.getPrecio();
        this.stock_total = articulo.getStock_total();
        this.stock_disponible = articulo.getStock_disponible();
        this.estado = articulo.getEstado();
    }
}