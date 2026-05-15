package com.Integrador.sistema_eventos.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@Builder
public class LoginResponseDTO {
    private String token;
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
    private List<String> roles;
}