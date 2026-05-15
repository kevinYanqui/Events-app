package com.Integrador.sistema_eventos.dto;

import com.Integrador.sistema_eventos.domain.Reserva;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.stream.Collectors;

@Getter
@Setter
public class ReservaResponseDTO {
    private Long id;
    private String clienteNombre;
    private LocalDate fechaEvento;
    private OffsetDateTime fechaReserva;
    private String lugar_evento;
    private String tipoEvento;
    private int totalArticulos;
    private BigDecimal costoTotal;
    private String estado;

    public ReservaResponseDTO(Reserva reserva) {
        this.id = reserva.getId();
        this.clienteNombre = reserva.getUsuario().getNombre() + " " + reserva.getUsuario().getApellido();
        this.fechaEvento = reserva.getFecha_evento();
        this.fechaReserva = reserva.getFecha_reserva();
        this.lugar_evento = reserva.getLugar_evento();
        this.tipoEvento = "Evento";
        this.totalArticulos = reserva.getDetalles().stream().mapToInt(d -> d.getCantidad()).sum();
        this.costoTotal = reserva.getCosto_total_calculado();
        this.estado = reserva.getEstado();
    }
}