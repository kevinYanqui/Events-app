package com.Integrador.sistema_eventos.controller;

import com.Integrador.sistema_eventos.domain.Reserva;
import com.Integrador.sistema_eventos.dto.ReservaDTO;
import com.Integrador.sistema_eventos.dto.ReservaResponseDTO;
import com.Integrador.sistema_eventos.dto.ReservaUpdateDTO;
import com.Integrador.sistema_eventos.dto.UbicacionDTO;
import com.Integrador.sistema_eventos.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @PostMapping
    public ResponseEntity<?> registrarReserva(@RequestBody ReservaDTO reservaDTO) {
        try {
            Reserva reservaCreada = reservaService.crearReserva(reservaDTO);
            return new ResponseEntity<>(reservaCreada, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping
    public ResponseEntity<List<ReservaResponseDTO>> listarReservas() {
        List<ReservaResponseDTO> reservas = reservaService.getAllReservas();
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> obtenerReservaPorId(@PathVariable Long id) {
        Reserva reserva = reservaService.getReservaById(id);
        return ResponseEntity.ok(reserva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> actualizarReserva(@PathVariable Long id, @RequestBody ReservaUpdateDTO updateDTO) {
        ReservaResponseDTO reservaActualizadaDTO = reservaService.actualizarReserva(id, updateDTO);
        return ResponseEntity.ok(reservaActualizadaDTO);
    }

    @PutMapping("/{id}/ubicacion")
    public ResponseEntity<?> actualizarUbicacion(@PathVariable Long id, @RequestBody UbicacionDTO request) {
        try {
            reservaService.actualizarUbicacion(id, request.getUbicacion());
            return new ResponseEntity<>("Ubicación actualizada correctamente.", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarReserva(@PathVariable Long id) {
        try {
            ReservaUpdateDTO updateDTO = new ReservaUpdateDTO();
            updateDTO.setEstado("Cancelada");
            ReservaResponseDTO reservaCancelada = reservaService.actualizarReserva(id, updateDTO);
            return ResponseEntity.ok(reservaCancelada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al cancelar la reserva: " + e.getMessage());
        }
    }
}