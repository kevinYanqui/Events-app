package com.Integrador.sistema_eventos.controller;

import com.Integrador.sistema_eventos.domain.Articulo;
import com.Integrador.sistema_eventos.dto.ArticuloDTO;
import com.Integrador.sistema_eventos.dto.ArticuloResponseDTO;
import com.Integrador.sistema_eventos.service.ArticuloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articulos")
public class ArticuloController {

    @Autowired
    private ArticuloService articuloService;

    @GetMapping("/dto")
    public ResponseEntity<List<ArticuloResponseDTO>> listarArticulosDTO() {
        List<ArticuloResponseDTO> articulos = articuloService.getAllArticulosDTO();
        return ResponseEntity.ok(articulos);
    }

    @GetMapping
    public ResponseEntity<List<Articulo>> listarArticulos() {
        List<Articulo> articulos = articuloService.getAllArticulos();
        return ResponseEntity.ok(articulos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Articulo> obtenerArticuloPorId(@PathVariable Long id) {
        Articulo articulo = articuloService.getArticuloById(id);
        return ResponseEntity.ok(articulo);
    }

    @PostMapping
    public ResponseEntity<Articulo> crearArticulo(@RequestBody ArticuloDTO articuloDTO) {
        Articulo nuevoArticulo = articuloService.saveArticulo(articuloDTO);
        return new ResponseEntity<>(nuevoArticulo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Articulo> actualizarArticulo(@PathVariable Long id, @RequestBody ArticuloDTO articuloDTO) {
        Articulo articuloActualizado = articuloService.updateArticulo(id, articuloDTO);
        return ResponseEntity.ok(articuloActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarArticulo(@PathVariable Long id) {
        articuloService.deleteArticulo(id);
        return ResponseEntity.noContent().build();
    }
}