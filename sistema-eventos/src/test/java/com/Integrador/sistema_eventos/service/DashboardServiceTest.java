package com.Integrador.sistema_eventos.service;

import com.Integrador.sistema_eventos.domain.Articulo;
import com.Integrador.sistema_eventos.domain.DetalleReserva;
import com.Integrador.sistema_eventos.domain.Reserva;
import com.Integrador.sistema_eventos.domain.Usuario;
import com.Integrador.sistema_eventos.dto.DashboardAnalyticsDTO;
import com.Integrador.sistema_eventos.repository.ArticuloRepository;
import com.Integrador.sistema_eventos.repository.DetalleReservaRepository;
import com.Integrador.sistema_eventos.repository.ReservaRepository;
import com.Integrador.sistema_eventos.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private ReservaRepository reservaRepository;
    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private ArticuloRepository articuloRepository;
    @Mock
    private DetalleReservaRepository detalleReservaRepository;

    @InjectMocks
    private DashboardService dashboardService;

    private Usuario usuario;
    private Articulo silla;
    private Articulo mesa;
    private Reserva reservaCompletada;
    private Reserva reservaPendiente;
    private DetalleReserva detalle1;
    private DetalleReserva detalle2;

    @BeforeEach
    void setUp() {
        // --- Setup de Entidades de Prueba ---
        usuario = new Usuario();
        usuario.setId(1L);

        silla = new Articulo();
        silla.setId(1L);
        silla.setNombre("Silla Tiffany");
        silla.setStock_disponible(4); // Stock bajo para alerta
        silla.setEstado("Disponible");
        silla.setPrecio(new BigDecimal("10.00"));

        mesa = new Articulo();
        mesa.setId(2L);
        mesa.setNombre("Mesa Redonda");
        mesa.setStock_disponible(20);
        mesa.setEstado("Disponible");
        mesa.setPrecio(new BigDecimal("30.00"));

        // Reserva 1: Completada en Mayo
        reservaCompletada = new Reserva();
        reservaCompletada.setUsuario(usuario);
        reservaCompletada.setEstado("Completada");
        reservaCompletada.setFecha_evento(LocalDate.of(2025, 5, 20));
        reservaCompletada.setCosto_total_calculado(new BigDecimal("250.00"));

        detalle1 = new DetalleReserva();
        detalle1.setReserva(reservaCompletada);
        detalle1.setArticulo(silla);
        detalle1.setCantidad(10);
        detalle1.setPrecio_unitario(new BigDecimal("10.00")); // Rentabilidad: 100

        detalle2 = new DetalleReserva();
        detalle2.setReserva(reservaCompletada);
        detalle2.setArticulo(mesa);
        detalle2.setCantidad(5);
        detalle2.setPrecio_unitario(new BigDecimal("30.00")); // Rentabilidad: 150

        // Reserva 2: Pendiente
        reservaPendiente = new Reserva();
        reservaPendiente.setUsuario(usuario);
        reservaPendiente.setEstado("Pendiente");
        reservaPendiente.setFecha_evento(LocalDate.of(2025, 6, 15));
        reservaPendiente.setCosto_total_calculado(new BigDecimal("50.00")); // No debe sumarse a ingresos
    }

    @Test
    void testGetDashboardAnalytics() {
        // 1. Configuración de Mocks
        when(reservaRepository.findAll()).thenReturn(Arrays.asList(reservaCompletada, reservaPendiente));
        when(detalleReservaRepository.findAll()).thenReturn(Arrays.asList(detalle1, detalle2));
        when(usuarioRepository.count()).thenReturn(15L); // Simular 15 clientes
        when(articuloRepository.findAll()).thenReturn(Arrays.asList(silla, mesa));

        // 2. Ejecución
        DashboardAnalyticsDTO analytics = dashboardService.getDashboardAnalytics(null, null);

        // 3. Verificaciones
        assertNotNull(analytics);

        // --- Verificaciones de KPIs principales ---
        assertEquals(2, analytics.getTotalReservas());
        assertEquals(15, analytics.getTotalClientes());
        assertEquals(1, analytics.getAlertasInventario()); // Solo la silla tiene stock <= 5
        assertEquals(0, new BigDecimal("250.00").compareTo(analytics.getIngresosTotales())); // Solo suma la completada

        // --- Verificación del conteo por estado ---
        List<Map<String, Object>> estadoReservas = analytics.getEstadoReservas();
        assertEquals(2, estadoReservas.size());
        assertTrue(estadoReservas.stream().anyMatch(map -> map.get("name").equals("Completada") && map.get("value").equals(1L)));
        assertTrue(estadoReservas.stream().anyMatch(map -> map.get("name").equals("Pendiente") && map.get("value").equals(1L)));

        // --- Verificación de ingresos mensuales ---
        List<Map<String, Object>> ingresosMensuales = analytics.getIngresosMensuales();
        assertEquals(1, ingresosMensuales.size());
        // LÍNEA CORREGIDA: Se quita el punto de "may."
        assertEquals("may", ingresosMensuales.get(0).get("name"));
        assertEquals(0, ((BigDecimal) ingresosMensuales.get(0).get("ingresos")).compareTo(new BigDecimal("250.00")));
        
        // --- Verificación de artículos populares ---
        List<Map<String, Object>> articulosPopulares = analytics.getArticulosPopulares();
        assertEquals(2, articulosPopulares.size());
        assertEquals("Mesa Redonda", articulosPopulares.get(0).get("name")); // Mayor rentabilidad
        assertEquals(0, ((BigDecimal) articulosPopulares.get(0).get("rentabilidad")).compareTo(new BigDecimal("150.00")));
        assertEquals("Silla Tiffany", articulosPopulares.get(1).get("name"));
        assertEquals(0, ((BigDecimal) articulosPopulares.get(1).get("rentabilidad")).compareTo(new BigDecimal("100.00")));
    }
}