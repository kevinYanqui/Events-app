package com.Integrador.sistema_eventos.service;

import com.Integrador.sistema_eventos.domain.Rol;
import com.Integrador.sistema_eventos.domain.Usuario;
import com.Integrador.sistema_eventos.dto.UsuarioRegistroDTO;
import com.Integrador.sistema_eventos.repository.RolRepository;
import com.Integrador.sistema_eventos.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private RolRepository rolRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private UsuarioRegistroDTO registroDTO;

    @BeforeEach
    void setUp() {
        registroDTO = new UsuarioRegistroDTO();
        registroDTO.setNombre("Juan");
        registroDTO.setApellido("Perez");
        registroDTO.setEmail("juan.perez@test.com");
        registroDTO.setPassword("password123");
        registroDTO.setTelefono("987654321");
    }

    @Test
    void testRegistrarNuevoUsuario_Exitoso() {
        // 1. Configuración de Mocks
        when(usuarioRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");

        Rol clienteRol = new Rol();
        clienteRol.setId(1);
        clienteRol.setNombre("CLIENTE");
        when(rolRepository.findByNombre("CLIENTE")).thenReturn(Optional.of(clienteRol));
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // 2. Ejecución
        Usuario nuevoUsuario = usuarioService.registrarNuevoUsuario(registroDTO);

        // 3. Verificaciones
        assertNotNull(nuevoUsuario);
        assertEquals("juan.perez@test.com", nuevoUsuario.getEmail());
        assertEquals("hashedPassword", nuevoUsuario.getPassword());
        assertTrue(nuevoUsuario.getRoles().stream().anyMatch(rol -> rol.getNombre().equals("CLIENTE")));

        verify(usuarioRepository, times(1)).existsByEmail("juan.perez@test.com");
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void testRegistrarNuevoUsuario_FallaEmailExistente() {
        // 1. Configuración del Mock para simular que el email ya existe
        when(usuarioRepository.existsByEmail("juan.perez@test.com")).thenReturn(true);

        // 2. Ejecución y Verificación de la excepción
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usuarioService.registrarNuevoUsuario(registroDTO);
        });

        assertEquals("Error: El correo electrónico ya está en uso.", exception.getMessage());

        // 3. Verificación de que no se intentó guardar nada
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }
}