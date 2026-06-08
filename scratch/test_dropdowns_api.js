const BASE = 'https://hrms-backend-s9pn.onrender.com';

async function getToken() {
  const res = await fetch(`${BASE}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'john@example.com', password: 'securepassword123' }),
  });
  const data = await res.json();
  return data.results.data.access;
}

async function testDropdowns() {
  const token = await getToken();
  const headers = { Authorization: `Bearer ${token}` };

  console.log('--- GET /api/company/document-dropdowns/ ---');
  let res = await fetch(`${BASE}/api/company/document-dropdowns/`, { headers });
  console.log('Status:', res.status);
  console.log(JSON.stringify(await res.json(), null, 2));

  console.log('\n--- GET /api/employee/dropdowns/ ---');
  let res2 = await fetch(`${BASE}/api/employee/dropdowns/`, { headers });
  console.log('Status:', res2.status);
  console.log(JSON.stringify(await res2.json(), null, 2));
}

testDropdowns();
