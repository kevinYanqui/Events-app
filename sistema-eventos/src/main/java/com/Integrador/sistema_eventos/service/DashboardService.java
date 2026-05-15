package com.Integrador.sistema_eventos.service;

import com.Integrador.sistema_eventos.domain.Articulo;
import com.Integrador.sistema_eventos.domain.DetalleReserva;
import com.Integrador.sistema_eventos.domain.Reserva;
import com.Integrador.sistema_eventos.dto.DashboardAnalyticsDTO;
import com.Integrador.sistema_eventos.repository.ArticuloRepository;
import com.Integrador.sistema_eventos.repository.DetalleReservaRepository;
import com.Integrador.sistema_eventos.repository.ReservaRepository;
import com.Integrador.sistema_eventos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ArticuloRepository articuloRepository;
    @Autowired
    private DetalleReservaRepository detalleReservaRepository;

    public DashboardAnalyticsDTO getDashboardAnalytics(LocalDate startDate, LocalDate endDate) {
        List<Reserva> todasLasReservas;
        List<DetalleReserva> todosLosDetalles;

        if (startDate != null && endDate != null) {
            todasLasReservas = reservaRepository.findByFechaEventoBetween(startDate, endDate);
            todosLosDetalles = detalleReservaRepository.findByReservaFechaEventoBetween(startDate, endDate);
        } else {
            todasLasReservas = reservaRepository.findAll();
            todosLosDetalles = detalleReservaRepository.findAll();
        }


        // Define el umbral para considerar el stock como bajo.
        final int umbralStockBajo = 5;

        // Calcula el número de artículos con stock bajo
        int alertasDeInventario = (int) articuloRepository.findAll().stream()
                .filter(articulo -> "Disponible".equalsIgnoreCase(articulo.getEstado()) && articulo.getStock_disponible() <= umbralStockBajo)
                .count();


        long totalClientes = usuarioRepository.count();

        BigDecimal ingresosTotales = todasLasReservas.stream()
                .filter(r -> "Completada".equals(r.getEstado()) && r.getCosto_total_calculado() != null)
                .map(Reserva::getCosto_total_calculado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Map<String, Object>> estadoReservas = todasLasReservas.stream()
                .collect(Collectors.groupingBy(Reserva::getEstado, Collectors.counting()))
                .entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> ingresosMensuales = todasLasReservas.stream()
                .filter(r -> "Completada".equals(r.getEstado()) && r.getCosto_total_calculado() != null)
                .collect(Collectors.groupingBy(r -> r.getFecha_evento().getMonth(),
                        Collectors.reducing(BigDecimal.ZERO, Reserva::getCosto_total_calculado, BigDecimal::add)))
                .entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey().getDisplayName(TextStyle.SHORT, new Locale("es", "ES")));
                    map.put("ingresos", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> articulosPopulares = todosLosDetalles.stream()
                .filter(detalle -> "Completada".equals(detalle.getReserva().getEstado()))
                .collect(Collectors.groupingBy(
                        detalle -> detalle.getArticulo().getNombre(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                detalle -> detalle.getPrecio_unitario().multiply(new BigDecimal(detalle.getCantidad())),
                                BigDecimal::add
                        )
                ))
                .entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(5)
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("rentabilidad", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());


        return DashboardAnalyticsDTO.builder()
                .totalReservas(todasLasReservas.size())
                .totalClientes(totalClientes)
                .ingresosTotales(ingresosTotales)
                .alertasInventario(alertasDeInventario)
                .estadoReservas(estadoReservas)
                .ingresosMensuales(ingresosMensuales)
                .articulosPopulares(articulosPopulares)
                .build();
    }
}