const BASE_URL = '/api/users';

export function getUserById(id) {
  return fetch(`${BASE_URL}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error('Erreur réseau');
      return res.json();
    });
}

export function updateUserWatchlist(id, watchlist) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ watchlist })
  })
  .then(res => {
    if (!res.ok) throw new Error('Erreur réseau');
    return res.json();
  });
}
