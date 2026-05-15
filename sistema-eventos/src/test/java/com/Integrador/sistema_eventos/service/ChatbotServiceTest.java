package com.Integrador.sistema_eventos.service;

import com.Integrador.sistema_eventos.domain.Articulo;
import com.Integrador.sistema_eventos.repository.ArticuloRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChatbotServiceTest {

    @Mock
    private ArticuloRepository articuloRepository;

    @InjectMocks
    private ChatbotService chatbotService;

    @Test
    void testGetBotResponse_Greeting() {
        String response = chatbotService.getBotResponse("hola");
        assertEquals("¡Hola! Soy Eclea, tu asistente virtual. Puedo darte información sobre nuestros artículos, precios, proceso de reserva y más. ¿En qué puedo ayudarte?", response);
    }

    @Test
    void testGetBotResponse_PriceQuery_General() {
        Articulo silla = new Articulo();
        silla.setNombre("Silla Tiffany");
        silla.setPrecio(new BigDecimal("15.50"));
        
        when(articuloRepository.findAll()).thenReturn(List.of(silla));

        String response = chatbotService.getBotResponse("¿Cuál es el costo de los artículos?");
        assertTrue(response.contains("nuestros precios de alquiler son: Silla Tiffany (S/. 15.50)"));
    }

    @Test
    void testGetBotResponse_PriceQuery_Specific() {
        Articulo silla = new Articulo();
        silla.setNombre("Silla Tiffany");
        silla.setPrecio(new BigDecimal("15.50"));

        when(articuloRepository.findAll()).thenReturn(List.of(silla));

        String response = chatbotService.getBotResponse("¿cuánto cuesta la silla tiffany?");
        assertEquals("El precio de alquiler para 'Silla Tiffany' es de S/. 15.50.", response);
    }
    
    @Test
    void testGetBotResponse_AvailabilityQuery_Specific_Available() {
        Articulo mesa = new Articulo();
        mesa.setNombre("Mesa Redonda");
        mesa.setStock_disponible(8);
        mesa.setEstado("Disponible");
        
        when(articuloRepository.findAll()).thenReturn(List.of(mesa));

        String response = chatbotService.getBotResponse("¿tienen stock de mesa redonda?");
        assertEquals("¡Sí! Actualmente tenemos 8 unidades de 'Mesa Redonda' disponibles para reservar.", response);
    }

    @Test
    void testGetBotResponse_AvailabilityQuery_Specific_NotAvailable() {
        Articulo atril = new Articulo();
        atril.setNombre("Atril de madera");
        atril.setStock_disponible(0);
        atril.setEstado("Disponible");
        
        when(articuloRepository.findAll()).thenReturn(List.of(atril));
        
        // El mensaje ahora incluye una palabra clave ("tienen") y el nombre completo del artículo.
        String response = chatbotService.getBotResponse("¿Tienen stock del Atril de madera?");
        assertEquals("Lo sentimos, por el momento no tenemos stock disponible de 'Atril de madera'.", response);
    }

    @Test
    void testGetBotResponse_BookingProcess() {
        String response = chatbotService.getBotResponse("¿cómo puedo reservar?");
        assertEquals("Puedes realizar una reserva directamente desde nuestra página web. Solo elige la fecha, selecciona los artículos que necesites y completa tus datos. ¡Es muy fácil!", response);
    }

    @Test
    void testGetBotResponse_DefaultResponse() {
        String response = chatbotService.getBotResponse("¿venden comida para perros?");
        assertEquals("Disculpa, no entendí tu pregunta. Puedo informarte sobre precios, disponibilidad, métodos de pago y cómo reservar. Intenta preguntarme de otra forma.", response);
    }
}