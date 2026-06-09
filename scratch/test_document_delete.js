const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://roka-stage-backend.hroptim.com';

async function getToken() {
  const res = await fetch(`${BASE}/api/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'john@example.com', password: 'securepassword123' }),
  });
  const data = await res.json();
  return data.results.data.access;
}

async function testDeletePath() {
  const token = await getToken();
  const headers = { Authorization: `Bearer ${token}` };

  console.log('--- DELETE with URL path id /api/employee/onboarding-documents/2/ ---');
  let deleteRes = await fetch(`${BASE}/api/employee/onboarding-documents/2/`, {
    method: 'DELETE',
    headers
  });
  console.log('Path Delete Status:', deleteRes.status);
  try {
    console.log(await deleteRes.json());
  } catch {
    console.log(await deleteRes.text());
  }

  console.log('\n--- DELETE with params id /api/employee/onboarding-documents/ with body ---');
  let deleteRes2 = await fetch(`${BASE}/api/employee/onboarding-documents/`, {
    method: 'DELETE',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 2 })
  });
  console.log('Body Delete Status:', deleteRes2.status);
  try {
    console.log(await deleteRes2.json());
  } catch {
    console.log(await deleteRes2.text());
  }
}

testDeletePath();
