package com.Integrador.sistema_eventos.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class PagoDTO {

    private long reservaId;
    private List<Item> items;
    @Data
    @NoArgsConstructor
    public static class Item{
        private String title;
        private Integer quantity;
        private double unitPrice;
    }
}
