import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 500 }, // Test tải cao cho Product
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  // Thay đổi URL nếu backend của bạn dùng port khác
  const res = http.get('http://localhost:8080/api/products');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'content type is json': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json'),
    'response time < 500ms': (r) => r.timings.duration < 500, // Product thường data nhiều nên cho phép chậm hơn Login xíu
  });

  sleep(1);
}


// Get-Content product-test.js | k6 run -