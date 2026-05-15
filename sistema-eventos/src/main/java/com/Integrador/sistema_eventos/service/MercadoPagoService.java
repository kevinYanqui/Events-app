package com.Integrador.sistema_eventos.service;

import com.Integrador.sistema_eventos.dto.PagoDTO;
import com.Integrador.sistema_eventos.repository.PagoRepository;
import com.mercadopago.MercadoPagoConfig;
import com.Integrador.sistema_eventos.dto.PagoDTO.Item;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.OffsetDateTime;


import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MercadoPagoService {

    @Autowired
    private PagoService pagoService;

    public String crearPreferenciaPago(PagoDTO requestBody) throws Exception {
        MercadoPagoConfig.setAccessToken("APP_USR-205648492046855-061903-34ff418973343a248f6cf25a3e81d796-2488322797");
        PreferenceClient client = new PreferenceClient();
        Map<String, Item> agrupados = new LinkedHashMap<>();

        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime expiration = now.plusSeconds(20);
        Duration duracion = Duration.between(OffsetDateTime.now(), expiration);


        for (Item item : requestBody.getItems()) {
            agrupados.merge(item.getTitle(), item, (existente, nuevo) -> {
                existente.setQuantity(existente.getQuantity() + nuevo.getQuantity());
                return existente;
            });
        }
        List<PreferenceItemRequest> items = agrupados.values().stream().map(i ->
                PreferenceItemRequest.builder()
                        .title(i.getTitle())
                        .quantity(i.getQuantity())
                        .unitPrice(BigDecimal.valueOf(i.getUnitPrice()))
                        .currencyId("PEN")
                        .build()
        ).collect(Collectors.toList());
        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success("https://tu-sitio.com/success")
                .pending("https://tu-sitio.com/pending")
                .failure("https://tu-sitio.com/failure")
                .build();
        PreferenceRequest preferenceRequest = PreferenceRequest.builder()

                .items(items)
                .backUrls(backUrls)
                .expirationDateFrom(now)
                .expirationDateTo(expiration)
                .autoReturn("approved")
                .metadata(Map.of("reserva_id", String.valueOf(requestBody.getReservaId())))
                .build();
        Preference preference = client.create(preferenceRequest);
        return preference.getInitPoint();
    }

    public void procesarWebhookPago(String paymentId) {
        try {
            System.out.println("[procesarWebhookPago] Obteniendo información del pago ID: " + paymentId);
            MercadoPagoConfig.setAccessToken("APP_USR-205648492046855-061903-34ff418973343a248f6cf25a3e81d796-2488322797");
            PaymentClient paymentClient = new PaymentClient();
            Payment payment = paymentClient.get(Long.parseLong(paymentId));
            System.out.println("[procesarWebhookPago] Estado del pago: " + payment.getStatus());

            if ("approved".equals(payment.getStatus())) {
                System.out.println("[procesarWebhookPago] Pago aprobado, registrando...");
                pagoService.registrarPago(payment);
            } else {
                System.out.println("[procesarWebhookPago] Pago no aprobado. Estado: " + payment.getStatus());
            }
        } catch (Exception e) {
            System.err.println("[procesarWebhookPago] Error procesando el pago ID: " + paymentId);
            e.printStackTrace();
        }
    }
}
