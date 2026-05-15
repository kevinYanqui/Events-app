
import http from 'k6/http';
import { check, sleep } from 'k6';

const authToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrZXZpbi55YW5xdWlAZW1haWwuY29tIiwiaWF0IjoxNzUzMzcwNTQ4LCJleHAiOjE3NTM0NTY5NDh9.xzxa-5h3GA3b0ehmIb5I8WPRiriqOwfQB78LaWT6wzg';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  // Creamos los encabezados (headers) con el token de autorización
  const params = {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  };

  // Hacemos la petición GET, pero incluyendo los encabezados (params)
  const res = http.get('http://localhost:8080/api/articulos', params);

  check(res, {
    'status was 200': (r) => r.status == 200,
    'transaction time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}