export function getToken() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    const { token } = JSON.parse(raw);
    return token;
  } catch {
    return null;
  }
}

export function authFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, headers });
}

export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) =>
          '%' + c.charCodeAt(0).toString(16).padStart(2, '0')
        )
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
} 