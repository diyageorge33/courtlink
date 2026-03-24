import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 100, // reduce for debugging
  duration: '60s',
};

export default function () {

  let payload = JSON.stringify({
    email: 'diyageo5221@gmail.com',
    password: 'diya1234'
  });

  let params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post('http://localhost:5000/api/auth/login', payload, params);

  console.log("STATUS:", res.status);
  console.log("BODY:", res.body);

  check(res, {
    'login success': (r) => r.status === 200,
  });

  sleep(1);
}