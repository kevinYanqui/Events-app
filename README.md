# Event Management & Reservation System

Este es un sistema full-stack diseñado para la gestión profesional de eventos. Permite a los clientes explorar un catálogo de artículos, realizar reservas y pagar en línea, mientras ofrece a los administradores herramientas avanzadas de control de inventario.

## Características Principales
* **Reservas en Tiempo Real:** Selección de artículos con validación de stock y fechas.
* **Pagos Integrados:** Procesamiento de pagos seguro a través de **Mercado Pago**.
* **Asistente Virtual:** Chatbot integrado para resolver dudas frecuentes de los usuarios.
* **Dashboard Administrativo:** Visualización de métricas, gestión de inventario (CRUD) y control de reservas.
* **Seguridad:** Autenticación y autorización basada en **JWT (JSON Web Tokens)**.

## Stack Tecnológico

### Backend
* **Lenguaje:** Java 17
* **Framework:** Spring Boot 3
* **Seguridad:** Spring Security & JWT
* **Base de Datos:** MySQL / PostgreSQL (JPA/Hibernate)
* **Integraciones:** Mercado Pago SDK

### Frontend
* **Framework:** React 18 (Vite)
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS
* **Iconos:** Lucide React

## Instalación

1. **Backend:**
   * Entra a la carpeta `sistema-eventos`.
   * Configura tus credenciales de base de datos y Mercado Pago en `application.properties`.
   * Ejecuta: `./mvnw spring-boot:run`

2. **Frontend:**
   * Entra a la carpeta `project`.
   * Instala dependencias: `npm install`
   * Inicia la app: `npm run dev`

## Nota
Este proyecto fue desarrollado como trabajo integrador, aplicando patrones de diseño de software, arquitecturas limpias y consumo de APIs de terceros en un entorno de producción simulado.
