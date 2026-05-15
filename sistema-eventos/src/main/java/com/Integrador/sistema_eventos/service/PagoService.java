package com.Integrador.sistema_eventos.service;

import com.Integrador.sistema_eventos.domain.Pago;
import com.Integrador.sistema_eventos.domain.Reserva;
import com.Integrador.sistema_eventos.repository.PagoRepository;
import com.Integrador.sistema_eventos.repository.ReservaRepository;
import com.mercadopago.resources.payment.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Map;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private ReservaService reservaService;

    public void registrarPago(Payment payment) {
        System.out.println("[registrarPago] Iniciando registro del pago...");
        Map<String, Object> metadata = payment.getMetadata();

        if (!metadata.containsKey("reserva_id")) {
            System.out.println("[registrarPago] Metadata no contiene reserva_id");
            return;
        }

        Long reservaId = Long.parseLong(metadata.get("reserva_id").toString());
        System.out.println("[registrarPago] Reserva ID obtenida: " + reservaId);

        reservaService.actualizarEstado(reservaId);

        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + reservaId));

        Pago nuevoPago = new Pago();
        nuevoPago.setReserva(reserva);
        nuevoPago.setMonto(payment.getTransactionAmount());

        String metodo = switch (payment.getPaymentMethodId()) {
            case "master" -> "MasterCard";
            case "visa" -> "Visa";
            case "amex" -> "American Express";
            case "debmaster" -> "Débito MasterCard";
            case "debvisa" -> "Débito Visa";
            case "diners" -> "Diners Club";
            case "naranja" -> "Tarjeta Naranja";
            case "paypal" -> "PayPal";
            default -> payment.getPaymentMethodId();
        };

        nuevoPago.setMetodo_pago(metodo);
        nuevoPago.setFecha_pago(OffsetDateTime.now());
        pagoRepository.save(nuevoPago);
        System.out.println("[registrarPago]Pago registrado correctamente");
    }
}
