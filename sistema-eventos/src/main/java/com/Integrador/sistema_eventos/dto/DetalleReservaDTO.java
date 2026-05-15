package com.Integrador.sistema_eventos.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class DetalleReservaDTO {
    private Long articuloId;
    private int cantidad;
    private BigDecimal precio_unitario;
}