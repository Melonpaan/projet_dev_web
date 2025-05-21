const BASE_URL = '/api/movies';

export function getAllMovies() {
  return fetch(BASE_URL)
    .then(res => {
      if (!res.ok) throw new Error('Erreur réseau');
      return res.json();
    });
}

export function searchMovies(term) {
  return getAllMovies().then(data =>
    data.filter(movie =>
      movie.title.toLowerCase().includes(term.toLowerCase())
    )
  );
}

export function getMovieById(id) {
  return fetch(`${BASE_URL}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error('Erreur réseau');
      return res.json();
    });
}

