package com.Integrador.sistema_eventos.service;

import com.Integrador.sistema_eventos.domain.Articulo;
import com.Integrador.sistema_eventos.dto.ArticuloDTO;
import com.Integrador.sistema_eventos.dto.ArticuloResponseDTO;
import com.Integrador.sistema_eventos.repository.ArticuloRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArticuloService {

    @Autowired
    private ArticuloRepository articuloRepository;

    public List<Articulo> getAllArticulos() {
        return articuloRepository.findAll();
    }

    @Transactional
    public Articulo saveArticulo(ArticuloDTO articuloDTO) {
        Articulo articulo = new Articulo();
        articulo.setNombre(articuloDTO.getNombre());
        articulo.setDescripcion(articuloDTO.getDescripcion());
        articulo.setPrecio(articuloDTO.getPrecio());
        articulo.setCategoria(articuloDTO.getCategoria());
        articulo.setStock_total(articuloDTO.getStock_total());
        articulo.setStock_disponible(articuloDTO.getStock_total());
        articulo.setEstado(articuloDTO.getEstado() != null ? articuloDTO.getEstado() : "Disponible");
        return articuloRepository.save(articulo);
    }

    @Transactional
    public Articulo updateArticulo(Long id, ArticuloDTO articuloDTO) {
        Articulo articulo = articuloRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artículo no encontrado con id: " + id));

        int stockReservado = articulo.getStock_total() - articulo.getStock_disponible();
        int nuevoStockTotal = articuloDTO.getStock_total();

        if (nuevoStockTotal < stockReservado) {
            throw new IllegalStateException("El nuevo stock total no puede ser menor que los artículos ya reservados. Stock reservado: " + stockReservado);
        }

        articulo.setNombre(articuloDTO.getNombre());
        articulo.setDescripcion(articuloDTO.getDescripcion());
        articulo.setPrecio(articuloDTO.getPrecio());
        articulo.setCategoria(articuloDTO.getCategoria());
        articulo.setStock_total(nuevoStockTotal);
        // El nuevo stock disponible se recalcula.
        articulo.setStock_disponible(nuevoStockTotal - stockReservado);
        articulo.setEstado(articuloDTO.getEstado());

        return articuloRepository.save(articulo);
    }

    public void deleteArticulo(Long id) {
        if (!articuloRepository.existsById(id)) {
            throw new EntityNotFoundException("Artículo no encontrado con id: " + id);
        }
        articuloRepository.deleteById(id);
    }

    public List<ArticuloResponseDTO> getAllArticulosDTO() {
        return articuloRepository.findAll().stream()
                .map(ArticuloResponseDTO::new)
                .collect(Collectors.toList());
    }

    public Articulo getArticuloById(Long id) {
        return articuloRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artículo no encontrado con id: " + id));
    }
}