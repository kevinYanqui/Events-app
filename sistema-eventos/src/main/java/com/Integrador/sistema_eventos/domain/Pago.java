package com.Integrador.sistema_eventos.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "pagos")
@Getter
@Setter
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;

    @Column(nullable = false)
    private BigDecimal monto;

    private String metodo_pago;

    @Column(columnDefinition = "TIMESTAMPTZ")
    private OffsetDateTime fecha_pago;

    @PrePersist
    protected void onCreate() {
        fecha_pago = OffsetDateTime.now();
    }
}