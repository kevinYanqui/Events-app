package com.Integrador.sistema_eventos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioRegistroDTO {
    @NotEmpty(message = "El nombre no puede estar vacío")
    private String nombre;

    @NotEmpty(message = "El apellido no puede estar vacío")
    private String apellido;

    @NotEmpty(message = "El email no puede estar vacío")
    @Email(message = "El email debe ser válido")
    private String email;

    @NotEmpty(message = "La contraseña no puede estar vacía")
    private String password;

    private String telefono;
}