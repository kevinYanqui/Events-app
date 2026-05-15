// advanced-flow.js
import http from 'k6/http';
import { check, sleep } from 'k6';

const authToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrZXZpbi55YW5xdWlAZW1haWwuY29tIiwiaWF0IjoxNzUzMzcwNTQ4LCJleHAiOjE3NTM0NTY5NDh9.xzxa-5h3GA3b0ehmIb5I8WPRiriqOwfQB78LaWT6wzg';

export const options = {
  stages: [
    { duration: '20s', target: 10 }, 
    { duration: '30s', target: 10 },
    { duration: '10s', target: 0 }, 
  ],
};

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  };

  // En cada iteración, elegimos un ID de artículo al azar entre 1 y 10.
  // Esto distribuye la carga y evita agotar el stock de un solo artículo.
  const randomArticuloId = Math.floor(Math.random() * 10) + 1;

  const reservaPayload = JSON.stringify({
    usuarioId: 1, 
    fecha_evento: "2025-12-24",
    lugar_evento: `Prueba de Carga Aleatoria`,
    detalles: [
      {
        articuloId: randomArticuloId,
        cantidad: 1 
      }
    ]
  });

  const reservaRes = http.post('http://localhost:8080/api/reservas', reservaPayload, params);

  check(reservaRes, {
    'Reserva creada exitosamente (status 201)': (r) => r.status === 201,
  });

  sleep(2);
}