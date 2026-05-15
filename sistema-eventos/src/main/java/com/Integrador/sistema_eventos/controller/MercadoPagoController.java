package com.Integrador.sistema_eventos.controller;

import com.Integrador.sistema_eventos.dto.PagoDTO;
import com.Integrador.sistema_eventos.service.MercadoPagoService;
import com.Integrador.sistema_eventos.service.PagoService;
import com.Integrador.sistema_eventos.service.ReservaService;
import com.mercadopago.net.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/mercadopago")
public class MercadoPagoController {

    @Autowired
    private MercadoPagoService mercadoPagoService;
    @Autowired
    private ReservaService reservaService;
    @Autowired
    private PagoService pagoService;

    @PostMapping
    public Map<String, String> crearPreferencia(@RequestBody PagoDTO requestBody) {
        Map<String, String> response = new HashMap<>();
        try {
            String initPoint = mercadoPagoService.crearPreferenciaPago(requestBody);
            response.put("init_point", initPoint);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Error al crear preferencia: " + e.getMessage());
        }return response;
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> recibirWebhook(@RequestBody Map<String, Object> payload) {
        System.out.println("[WEBHOOK] Recibido payload: " + payload);
        try {
            String type = (String) payload.get("type");
            Object actionObj = payload.get("action");
            String action = actionObj != null ? actionObj.toString() : "";

            if ("payment".equals(type) && action.contains("payment.")) {
                Map<String, Object> data = (Map<String, Object>) payload.get("data");
                String paymentId = data.get("id").toString();
                System.out.println("[WEBHOOK] Procesando pago con ID: " + paymentId);
                mercadoPagoService.procesarWebhookPago(paymentId);
            } else {
                System.out.println("[WEBHOOK] Tipo no relevante: " + type + ", acción: " + action);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error procesando webhook");
        }
        return ResponseEntity.ok("Webhook recibido");
    }
}
