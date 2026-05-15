package com.Integrador.sistema_eventos.service;

import com.Integrador.sistema_eventos.domain.*;
import com.Integrador.sistema_eventos.dto.DetalleReservaDTO;
import com.Integrador.sistema_eventos.dto.ReservaDTO;
import com.Integrador.sistema_eventos.dto.ReservaResponseDTO;
import com.Integrador.sistema_eventos.dto.ReservaUpdateDTO;
import com.Integrador.sistema_eventos.repository.ArticuloRepository;
import com.Integrador.sistema_eventos.repository.ReservaRepository;
import com.Integrador.sistema_eventos.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private ArticuloRepository articuloRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public Reserva crearReserva(ReservaDTO reservaDTO) {

        // Validación de la fecha del evento
        if (reservaDTO.getFecha_evento().isBefore(LocalDate.now().plusDays(7))) {
            throw new IllegalArgumentException("La fecha del evento debe ser con al menos 7 días de anticipación.");
        }

        Usuario usuario = usuarioRepository.findById(reservaDTO.getUsuarioId())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        Reserva nuevaReserva = new Reserva();
        nuevaReserva.setUsuario(usuario);
        nuevaReserva.setFecha_evento(reservaDTO.getFecha_evento());
        nuevaReserva.setLugar_evento(reservaDTO.getLugar_evento());
        nuevaReserva.setEstado("Pendiente");

        List<DetalleReserva> detalles = new ArrayList<>();
        BigDecimal costoTotal = BigDecimal.ZERO;

        for (DetalleReservaDTO detalleDTO : reservaDTO.getDetalles()) {
            Articulo articulo = articuloRepository.findById(detalleDTO.getArticuloId())
                    .orElseThrow(() -> new EntityNotFoundException("Artículo no encontrado con id: " + detalleDTO.getArticuloId()));

            if (!"Disponible".equalsIgnoreCase(articulo.getEstado())) {
                throw new IllegalStateException("El artículo '" + articulo.getNombre() + "' no está disponible para reservas.");
            }

            if (articulo.getStock_disponible() < detalleDTO.getCantidad()) {
                throw new IllegalStateException("No hay stock suficiente para el artículo: " + articulo.getNombre());
            }

            articulo.setStock_disponible(articulo.getStock_disponible() - detalleDTO.getCantidad());
            articuloRepository.save(articulo);

            DetalleReserva detalle = new DetalleReserva();
            detalle.setReserva(nuevaReserva);
            detalle.setArticulo(articulo);
            detalle.setCantidad(detalleDTO.getCantidad());
            BigDecimal precioUnitario = articulo.getPrecio();
            detalle.setPrecio_unitario(precioUnitario);
            BigDecimal subtotal = precioUnitario.multiply(new BigDecimal(detalleDTO.getCantidad()));
            costoTotal = costoTotal.add(subtotal);
            detalles.add(detalle);
        }

        nuevaReserva.setDetalles(detalles);
        nuevaReserva.setCosto_total_calculado(costoTotal);

        return reservaRepository.save(nuevaReserva);
    }

    public List<ReservaResponseDTO> getAllReservas() {
        return reservaRepository.findAll().stream()
                .map(ReservaResponseDTO::new)
                .collect(Collectors.toList());
    }

    public Reserva getReservaById(Long id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reserva no encontrada con id: " + id));
    }

    @Transactional
    public ReservaResponseDTO actualizarReserva(Long id, ReservaUpdateDTO updateDTO) {
        Reserva reserva = getReservaById(id);

        // Actualizar lugar
        if (updateDTO.getLugar_evento() != null && !updateDTO.getLugar_evento().isEmpty()) {
            reserva.setLugar_evento(updateDTO.getLugar_evento());
        }

        // Actualizar estado
        if (updateDTO.getEstado() != null && !updateDTO.getEstado().isEmpty()) {
            if (updateDTO.getEstado().equals("Cancelada") && !reserva.getEstado().equals("Cancelada")) {
                for (DetalleReserva detalle : reserva.getDetalles()) {
                    Articulo articulo = detalle.getArticulo();
                    articulo.setStock_disponible(articulo.getStock_disponible() + detalle.getCantidad());
                    articuloRepository.save(articulo);
                }
            }
            reserva.setEstado(updateDTO.getEstado());
        }

        Reserva reservaGuardada = reservaRepository.save(reserva);
        return new ReservaResponseDTO(reservaGuardada);
    }

    public void actualizarUbicacion(Long reservaId, String nuevaUbicacion) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new EntityNotFoundException("Reserva no encontrada con ID: " + reservaId));
        if (nuevaUbicacion == null || nuevaUbicacion.trim().isEmpty()) {
            throw new IllegalArgumentException("La ubicación no puede estar vacía.");
        }
        reserva.setLugar_evento(nuevaUbicacion);
        reservaRepository.save(reserva);
    }

    public void actualizarEstado(Long reservaId) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + reservaId));
        reserva.setEstado("Confirmada");
        reservaRepository.save(reserva);
    }
}