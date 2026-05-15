package com.Integrador.sistema_eventos.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservas")
@Getter
@Setter
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDate fecha_evento;

    @Column(nullable = false)
    private String lugar_evento;

    @Column(nullable = false)
    private String estado; // "Pendiente", "Confirmada", "Cancelada", "Completada"

    private BigDecimal costo_total_calculado;

    @Column(columnDefinition = "TIMESTAMPTZ")
    private OffsetDateTime fecha_reserva;

    @OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<DetalleReserva> detalles = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        fecha_reserva = OffsetDateTime.now();
    }
}