package com.Integrador.sistema_eventos.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ReservaDTO {
    private Long usuarioId;
    private LocalDate fecha_evento;
    private String lugar_evento;
    private List<DetalleReservaDTO> detalles;
}