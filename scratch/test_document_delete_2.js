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

async function testDelete() {
  const token = await getToken();
  
  // 1. DELETE /api/employee/onboarding-documents/ with body { id: 2 }
  try {
    const res = await fetch(`${BASE}/api/employee/onboarding-documents/`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: 2 })
    });
    console.log('DELETE with body status:', res.status);
    const text = await res.text();
    console.log('Response:', text.substring(0, 500));
  } catch (err) {
    console.error('DELETE with body error:', err.message);
  }

  // 2. DELETE /api/employee/onboarding-documents/ with body { employee_id: 1, id: 2 }
  try {
    const res = await fetch(`${BASE}/api/employee/onboarding-documents/`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ employee_id: 1, id: 2 })
    });
    console.log('DELETE with employee_id/id body status:', res.status);
    const text = await res.text();
    console.log('Response:', text.substring(0, 500));
  } catch (err) {
    console.error('DELETE with employee_id/id body error:', err.message);
  }

  // 3. DELETE /api/employee/onboarding-documents/ with query param ?id=2
  try {
    const res = await fetch(`${BASE}/api/employee/onboarding-documents/?id=2`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('DELETE with query param id status:', res.status);
    const text = await res.text();
    console.log('Response:', text.substring(0, 500));
  } catch (err) {
    console.error('DELETE with query param id error:', err.message);
  }

  // 4. PUT /api/employee/onboarding-documents/ with body { id: 2, deleted: true } (soft delete check)
  try {
    const res = await fetch(`${BASE}/api/employee/onboarding-documents/`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: 2, deleted: true, is_active: false, employee: 1, document_type: 1 })
    });
    console.log('PUT soft-delete status:', res.status);
    const text = await res.text();
    console.log('Response:', text.substring(0, 500));
  } catch (err) {
    console.error('PUT soft-delete error:', err.message);
  }
}

testDelete();
