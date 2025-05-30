const BASE_URL = '/api/movies';

export function getAllMovies() {
  return fetch(BASE_URL)
    .then(res => {
      if (!res.ok) throw new Error('Erreur réseau lors de la récupération de tous les films');
      return res.json();
    });
}

export function searchMovies(term) {
  return fetch(`${BASE_URL}/search/${encodeURIComponent(term)}`)
    .then(res => {
      if (!res.ok) throw new Error(`Erreur réseau lors de la recherche de films pour: ${term}`);
      return res.json();
    });
}

export function getMovieById(id) {
  return fetch(`${BASE_URL}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error(`Erreur réseau lors de la récupération du film avec ID: ${id}`);
      return res.json();
    });
}

// Potentiellement, ajouter ici la fonction pour mettre à jour un film (PUT)
// export function updateMovie(id, movieData) {
//   return fetch(`${BASE_URL}/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(movieData),
//   }).then(res => {
//     if (!res.ok) throw new Error(`Erreur réseau lors de la mise à jour du film avec ID: ${id}`);
//     return res.json(); // Ou une autre réponse appropriée du backend
//   });
// }

