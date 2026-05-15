package com.Integrador.sistema_eventos.service;

import com.Integrador.sistema_eventos.domain.Articulo;
import com.Integrador.sistema_eventos.dto.ArticuloDTO;
import com.Integrador.sistema_eventos.repository.ArticuloRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Habilita la integración con Mockito
class ArticuloServiceTest {

    @Mock // Crea un simulacro (mock) del repositorio. No usará la BD real.
    private ArticuloRepository articuloRepository;

    @InjectMocks // Crea una instancia de ArticuloService e inyecta los mocks (el ArticuloRepository simulado).
    private ArticuloService articuloService;

    private Articulo articuloExistente;
    private ArticuloDTO articuloDTO;

    @BeforeEach
    void setUp() {
        // Preparamos los datos que usaremos en varias pruebas
        articuloExistente = new Articulo();
        articuloExistente.setId(1L);
        articuloExistente.setNombre("Silla Tiffany");
        articuloExistente.setStock_total(20);
        articuloExistente.setStock_disponible(15); // 5 sillas ya están reservadas
        articuloExistente.setPrecio(new BigDecimal("10.00"));
        articuloExistente.setEstado("Disponible");
        articuloExistente.setCategoria("Sillas");

        articuloDTO = new ArticuloDTO();
        articuloDTO.setNombre("Silla Tiffany Dorada");
        articuloDTO.setStock_total(30); // Se quiere actualizar el stock total
        articuloDTO.setPrecio(new BigDecimal("12.50"));
        articuloDTO.setEstado("Disponible");
        articuloDTO.setCategoria("Sillas");
    }

    @Test
    void testUpdateArticulo_Exitoso() {
        // 1. Configuración del Mock
        // Cuando se llame a findById(1L), el mock debe devolver nuestro artículo de prueba.
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articuloExistente));
        // Cuando se llame a save(), simplemente devuelve el artículo que se le pasó.
        when(articuloRepository.save(any(Articulo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // 2. Ejecución del método a probar
        Articulo articuloActualizado = articuloService.updateArticulo(1L, articuloDTO);

        // 3. Verificaciones (Asserts)
        assertNotNull(articuloActualizado);
        assertEquals("Silla Tiffany Dorada", articuloActualizado.getNombre());
        assertEquals(30, articuloActualizado.getStock_total());
        // Verificación clave: El stock disponible debe ser el nuevo stock total (30) menos las 5 unidades ya reservadas.
        assertEquals(25, articuloActualizado.getStock_disponible());

        // Verifica que el método save() fue llamado exactamente una vez.
        verify(articuloRepository, times(1)).save(any(Articulo.class));
    }

    @Test
    void testUpdateArticulo_ErrorStockInsuficiente() {
        // 1. Configuración del DTO para simular el error
        // El nuevo stock total (4) es menor que las 5 sillas ya reservadas.
        articuloDTO.setStock_total(4);

        // 2. Configuración del Mock
        when(articuloRepository.findById(1L)).thenReturn(Optional.of(articuloExistente));

        // 3. Ejecución y Verificación
        // Comprobamos que se lanza la excepción que esperamos
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            articuloService.updateArticulo(1L, articuloDTO);
        });

        assertEquals("El nuevo stock total no puede ser menor que los artículos ya reservados. Stock reservado: 5", exception.getMessage());

        // Verificamos que el método save() nunca fue llamado, porque la operación falló antes.
        verify(articuloRepository, never()).save(any(Articulo.class));
    }

    @Test
    void testUpdateArticulo_NoEncontrado() {
        // 1. Configuración del Mock
        // Simulamos que el artículo con id 99L no existe.
        when(articuloRepository.findById(99L)).thenReturn(Optional.empty());

        // 2. Ejecución y Verificación
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            articuloService.updateArticulo(99L, articuloDTO);
        });

        assertEquals("Artículo no encontrado con id: 99", exception.getMessage());
    }
}