package com.Integrador.sistema_eventos.service;

import com.Integrador.sistema_eventos.domain.Rol;
import com.Integrador.sistema_eventos.domain.Usuario;
import com.Integrador.sistema_eventos.dto.UsuarioRegistroDTO;
import com.Integrador.sistema_eventos.repository.RolRepository;
import com.Integrador.sistema_eventos.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RolRepository rolRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario registrarNuevoUsuario(UsuarioRegistroDTO registroDTO) {
        if (usuarioRepository.existsByEmail(registroDTO.getEmail())) {
            throw new RuntimeException("Error: El correo electrónico ya está en uso.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(registroDTO.getNombre());
        usuario.setApellido(registroDTO.getApellido());
        usuario.setEmail(registroDTO.getEmail());
        usuario.setPassword(passwordEncoder.encode(registroDTO.getPassword()));
        usuario.setTelefono(registroDTO.getTelefono());

        Rol rolUsuario = rolRepository.findByNombre("CLIENTE")
                .orElseThrow(() -> new RuntimeException("Error: Rol no encontrado."));
        usuario.setRoles(new HashSet<>(Collections.singletonList(rolUsuario)));

        return usuarioRepository.save(usuario);
    }

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }
}