package com.Integrador.sistema_eventos.service;

import com.Integrador.sistema_eventos.domain.Articulo;
import com.Integrador.sistema_eventos.repository.ArticuloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    @Autowired
    private ArticuloRepository articuloRepository;

    public String getBotResponse(String userMessage) {
        String lowerCaseMessage = userMessage.toLowerCase().trim();

        // --- INTENCIÓN: Saludo ---
        if (isGreeting(lowerCaseMessage)) {
            return "¡Hola! Soy Eclea, tu asistente virtual. Puedo darte información sobre nuestros artículos, precios, proceso de reserva y más. ¿En qué puedo ayudarte?";
        }

        // --- INTENCIÓN: Consultar Precios ---
        if (isPriceQuery(lowerCaseMessage)) {
            Optional<Articulo> articuloEspecifico = findArticuloInMessage(lowerCaseMessage);
            if (articuloEspecifico.isPresent()) {
                Articulo art = articuloEspecifico.get();
                return String.format("El precio de alquiler para '%s' es de S/. %.2f.", art.getNombre(), art.getPrecio());
            } else {
                List<Articulo> articulos = articuloRepository.findAll();
                if (articulos.isEmpty()) {
                    return "Lo siento, no tengo información de precios en este momento.";
                }
                String listaPrecios = articulos.stream()
                        .map(art -> String.format("%s (S/. %.2f)", art.getNombre(), art.getPrecio()))
                        .collect(Collectors.joining(", "));
                return "Claro, nuestros precios de alquiler son: " + listaPrecios + ".";
            }
        }

        // --- INTENCIÓN: Consultar Disponibilidad ---
        if (isAvailabilityQuery(lowerCaseMessage)) {
            Optional<Articulo> articuloEspecifico = findArticuloInMessage(lowerCaseMessage);
            if (articuloEspecifico.isPresent()) {
                Articulo art = articuloEspecifico.get();
                if (art.getStock_disponible() > 0 && "Disponible".equalsIgnoreCase(art.getEstado())) {
                    return String.format("¡Sí! Actualmente tenemos %d unidades de '%s' disponibles para reservar.", art.getStock_disponible(), art.getNombre());
                } else {
                    return String.format("Lo sentimos, por el momento no tenemos stock disponible de '%s'.", art.getNombre());
                }
            } else {
                List<Articulo> disponibles = articuloRepository.findAll().stream()
                        .filter(a -> a.getStock_disponible() > 0 && "Disponible".equalsIgnoreCase(a.getEstado()))
                        .collect(Collectors.toList());
                if (disponibles.isEmpty()) {
                    return "Lo siento, ahora mismo no tenemos artículos disponibles para alquilar.";
                }
                String listaDisponibles = disponibles.stream()
                        .map(Articulo::getNombre)
                        .collect(Collectors.joining(", "));
                return "Los artículos que tenemos disponibles son: " + listaDisponibles + ".";
            }
        }

        // --- INTENCIÓN: Cómo Reservar ---
        if (isBookingProcessQuery(lowerCaseMessage)) {
            return "Puedes realizar una reserva directamente desde nuestra página web. Solo elige la fecha, selecciona los artículos que necesites y completa tus datos. ¡Es muy fácil!";
        }

        // --- INTENCIÓN: Métodos de Pago ---
        if (isPaymentMethodQuery(lowerCaseMessage)) {
            return "Aceptamos pagos mediante transferencia bancaria, depósito en efectivo y tarjetas de crédito/débito a través de un enlace de pago seguro que te enviaremos.";
        }

        // --- INTENCIÓN: Política de Cancelación ---
        if (isCancellationQuery(lowerCaseMessage)) {
            return "Nuestra política permite cancelar sin cargos hasta 1 semana antes del evento. Cancelaciones con menos de 72 horas tendrán un cargo del 25% del valor de la reserva.";
        }

        // --- INTENCIÓN: Ubicación y Horarios ---
        if (isLocationQuery(lowerCaseMessage)) {
            return "Estamos ubicados en Calle 13 de Junio 108, Urb. Los Olivos, en el distrito de José Luis Bustamante y Rivero, Arequipa.";
        }
        if (isHoursQuery(lowerCaseMessage)) {
            return "Nuestro horario de atención es de lunes a viernes de 9:00 am a 6:00 pm y sábados de 9:00 am a 1:00 pm.";
        }

        // --- INTENCIÓN: Agradecimiento / Despedida ---
        if (isGratitude(lowerCaseMessage)) {
            return "¡De nada! Estoy aquí para ayudarte. Si tienes más preguntas, no dudes en consultarme.";
        }

        // --- Respuesta por Defecto ---
        return "Disculpa, no entendí tu pregunta. Puedo informarte sobre precios, disponibilidad, métodos de pago y cómo reservar. Intenta preguntarme de otra forma.";
    }

    private Optional<Articulo> findArticuloInMessage(String lowerCaseMessage) {
        return articuloRepository.findAll().stream()
                .filter(articulo -> lowerCaseMessage.contains(articulo.getNombre().toLowerCase()))
                .findFirst();
    }

    // --- Métodos de ayuda para detectar intenciones ---
    private boolean isGreeting(String msg) {
        return msg.startsWith("hola") || msg.startsWith("buenos días") || msg.startsWith("buenas tardes");
    }

    private boolean isPriceQuery(String msg) {
        return msg.contains("precio") || msg.contains("costo") || msg.contains("cuesta") || msg.contains("tarifa");
    }

    private boolean isAvailabilityQuery(String msg) {
        return msg.contains("disponible") || msg.contains("disponibilidad") || msg.contains("stock") || msg.contains("tienen");
    }

    private boolean isBookingProcessQuery(String msg) {
        return msg.contains("reservar") || msg.contains("reserva") || msg.contains("proceso");
    }

    private boolean isPaymentMethodQuery(String msg) {
        return msg.contains("pago") || msg.contains("pagar") || msg.contains("deposito") || msg.contains("transferencia") || msg.contains("tarjeta");
    }

    private boolean isCancellationQuery(String msg) {
        return msg.contains("cancelar") || msg.contains("cancelación");
    }

    private boolean isLocationQuery(String msg) {
        return msg.contains("ubicación") || msg.contains("dirección") || msg.contains("dónde están");
    }

    private boolean isHoursQuery(String msg) {
        return msg.contains("horario") || msg.contains("atención") || msg.contains("atienden");
    }

    private boolean isGratitude(String msg) {
        return msg.contains("gracias") || msg.contains("muchas gracias") || msg.contains("excelente");
    }
}