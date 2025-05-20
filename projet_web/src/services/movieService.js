const BASE_URL = '/api/movies';

export function getAllMovies() {
  return fetch(BASE_URL).then(res => {
    if (!res.ok) throw new Error('Erreur réseau');
    return res.json();
  });
}

export function searchMovies(term) {
  const url = `${BASE_URL}?title_like=${encodeURIComponent(term)}`;
  return fetch(url).then(res => {
    if (!res.ok) throw new Error('Erreur réseau');
    return res.json();
  });
}

export function getMovieById(id) {
  return fetch(`${BASE_URL}/${id}`).then(res => {
    if (!res.ok) throw new Error('Erreur réseau');
    return res.json();
  });
}
