package com.Integrador.sistema_eventos.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
public class DashboardAnalyticsDTO {
    private long totalReservas;
    private long totalClientes;
    private BigDecimal ingresosTotales;
    private int alertasInventario;
    private List<Map<String, Object>> ingresosMensuales;
    private List<Map<String, Object>> estadoReservas;
    private List<Map<String, Object>> articulosPopulares;
}