package com.Integrador.sistema_eventos.controller;

import com.Integrador.sistema_eventos.domain.Usuario;
import com.Integrador.sistema_eventos.dto.LoginRequest;
import com.Integrador.sistema_eventos.dto.LoginResponseDTO;
import com.Integrador.sistema_eventos.dto.UsuarioRegistroDTO;
import com.Integrador.sistema_eventos.repository.UsuarioRepository;
import com.Integrador.sistema_eventos.security.JwtUtil;
import com.Integrador.sistema_eventos.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername()).orElseThrow(
                () -> new RuntimeException("Usuario no encontrado después de la autenticación")
        );

        LoginResponseDTO response = LoginResponseDTO.builder()
                .token(jwt)
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .telefono(usuario.getTelefono())
                .roles(usuario.getRoles().stream().map(rol -> rol.getNombre()).collect(Collectors.toList()))
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioRegistroDTO registroDTO) {
        try {
            usuarioService.registrarNuevoUsuario(registroDTO);
            return ResponseEntity.ok("Usuario registrado exitosamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<Usuario> usuarios = usuarioService.findAll();
        List<Map<String, Object>> response = usuarios.stream().map(usuario -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", usuario.getId());
            userMap.put("nombreCompleto", usuario.getNombre() + " " + usuario.getApellido());
            userMap.put("email", usuario.getEmail());
            return userMap;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}