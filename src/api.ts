const AUTH_URL = 'https://functions.poehali.dev/bff48644-cb9e-40db-9a4a-12423b8b046f';
const PURCHASES_URL = 'https://functions.poehali.dev/70059823-fafd-47b0-8f27-142a240387ec';

function getToken() {
  return localStorage.getItem('pp_token') || '';
}

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

export async function apiRegister(email: string, first_name: string, last_name: string, password: string) {
  const r = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'register', email, first_name, last_name, password }),
  });
  return r.json();
}

export async function apiLogin(email: string, password: string) {
  const r = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', email, password }),
  });
  return r.json();
}

export async function apiMe() {
  const r = await fetch(AUTH_URL, { headers: authHeaders() });
  return r.json();
}

export async function apiGetPurchases() {
  const r = await fetch(PURCHASES_URL, { headers: authHeaders() });
  return r.json();
}

export async function apiBuyPrediction(data: {
  match_name: string; league: string; sport: string;
  analyst: string; price: number; prediction: string; match_date: string;
}) {
  const r = await fetch(PURCHASES_URL, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return r.json();
}
