import http from 'k6/http';
import { check, sleep } from 'k6';

// Cấu hình Load Test (b)
export const options = {
  stages: [
    { duration: '30s', target: 100 },  // Mốc 1: 100 users
    { duration: '1m', target: 500 },   // Mốc 2: Tăng lên 500 users
    { duration: '1m', target: 1000 },  // Mốc 3: Đỉnh điểm 1000 users (Stress Test)
    { duration: '30s', target: 0 },    // Giảm dần về 0
  ],
  // Để test mức 500, 1000 users, bạn chỉ cần sửa số target ở trên
};

export default function () {
  const url = 'http://localhost:8080/api/auth/login';
  const payload = JSON.stringify({
    username: 'testuser',
    password: 'Test123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  // Kiểm tra kết quả (Assert)
  check(res, {
    'status is 200': (r) => r.status === 200,
    'token exists': (r) => r.json('token') !== undefined,
    'response time < 200ms': (r) => r.timings.duration < 200, // Yêu cầu về thời gian phản hồi
  });

  sleep(1); // Mỗi user nghỉ 1s trước khi request tiếp
}

// Get-Content login-test.js | k6 run -
// k6 run login-test.js