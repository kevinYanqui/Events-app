package com.Integrador.sistema_eventos.service;

import com.Integrador.sistema_eventos.domain.Articulo;
import com.Integrador.sistema_eventos.domain.DetalleReserva;
import com.Integrador.sistema_eventos.domain.Reserva;
import com.Integrador.sistema_eventos.domain.Usuario;
import com.Integrador.sistema_eventos.dto.DetalleReservaDTO;
import com.Integrador.sistema_eventos.dto.ReservaDTO;
import com.Integrador.sistema_eventos.dto.ReservaUpdateDTO;
import com.Integrador.sistema_eventos.repository.ArticuloRepository;
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
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {

    @Mock
    private ReservaRepository reservaRepository;
    @Mock
    private ArticuloRepository articuloRepository;
    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ReservaService reservaService;

    private Usuario usuario;
    private Articulo articulo;
    private ReservaDTO reservaDTO;
    private DetalleReservaDTO detalleDTO;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Carlos");
        usuario.setApellido("Soto"); // Añadido para que el nombre completo funcione

        articulo = new Articulo();
        articulo.setId(1L);
        articulo.setNombre("Silla");
        articulo.setStock_disponible(10);
        articulo.setStock_total(10);
        articulo.setPrecio(new BigDecimal("50.00"));
        articulo.setEstado("Disponible");

        detalleDTO = new DetalleReservaDTO();
        detalleDTO.setArticuloId(1L);
        detalleDTO.setCantidad(5);
        detalleDTO.setPrecio_unitario(new BigDecimal("50.00"));

        reservaDTO = new ReservaDTO();
        reservaDTO.setUsuarioId(1L);
        reservaDTO.setFecha_evento(LocalDate.now().plusDays(10));
        reservaDTO.setLugar_evento("Salon Principal");
        reservaDTO.setDetalles(Collections.singletonList(detalleDTO));
    }

    @Test
    void testCrearReserva_Exitoso() {
        // 1. Configuración de Mocks
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articulo));
        when(reservaRepository.save(any(Reserva.class))).thenAnswer(inv -> inv.getArgument(0));

        // 2. Ejecución
        Reserva nuevaReserva = reservaService.crearReserva(reservaDTO);

        // 3. Verificaciones
        assertNotNull(nuevaReserva);
        assertEquals("Pendiente", nuevaReserva.getEstado());
        assertEquals(0, new BigDecimal("250.00").compareTo(nuevaReserva.getCosto_total_calculado()));
        assertEquals(5, articulo.getStock_disponible()); // Se debe reducir el stock

        verify(articuloRepository, times(1)).save(articulo);
        verify(reservaRepository, times(1)).save(any(Reserva.class));
    }

    @Test
    void testCrearReserva_FallaStockInsuficiente() {
        // 1. Configuración
        articulo.setStock_disponible(3); // Menos stock que el solicitado (5)
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articulo));

        // 2. Ejecución y Verificación
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            reservaService.crearReserva(reservaDTO);
        });
        assertEquals("No hay stock suficiente para el artículo: Silla", exception.getMessage());

        verify(reservaRepository, never()).save(any(Reserva.class));
    }

    @Test
    void testCrearReserva_FallaFechaInvalida() {
        // 1. Configuración
        reservaDTO.setFecha_evento(LocalDate.now().plusDays(5)); // Menos de 7 días

        // 2. Ejecución y Verificación
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            reservaService.crearReserva(reservaDTO);
        });
        assertEquals("La fecha del evento debe ser con al menos 7 días de anticipación.", exception.getMessage());
    }
    
    @Test
    void testActualizarReserva_CancelarReserva() {
        // 1. Setup de la reserva existente
        Reserva reservaExistente = new Reserva();
        reservaExistente.setId(1L);
        reservaExistente.setEstado("Confirmada");
        reservaExistente.setUsuario(this.usuario);

        DetalleReserva detalle = new DetalleReserva();
        detalle.setArticulo(articulo);
        detalle.setCantidad(5);
        reservaExistente.setDetalles(Collections.singletonList(detalle));
        
        // Simular que el artículo ya tenía el stock descontado
        articulo.setStock_disponible(5);

        ReservaUpdateDTO updateDTO = new ReservaUpdateDTO();
        updateDTO.setEstado("Cancelada");

        // 2. Configuración de Mocks
        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reservaExistente));
        when(reservaRepository.save(any(Reserva.class))).thenAnswer(inv -> inv.getArgument(0));

        // 3. Ejecución
        reservaService.actualizarReserva(1L, updateDTO);

        // 4. Verificaciones
        // El stock disponible debe regresar a su valor original (5 + 5 = 10)
        assertEquals(10, articulo.getStock_disponible());
        assertEquals("Cancelada", reservaExistente.getEstado());
        verify(articuloRepository, times(1)).save(articulo);
        verify(reservaRepository, times(1)).save(reservaExistente);
    }
}