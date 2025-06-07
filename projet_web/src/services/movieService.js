const BASE_URL = '/api/movies';

/**
 * Récupère la liste complète des films depuis l'API.
 * @returns {Promise<Array>} Promesse résolue avec le tableau des films.
 */
export function getAllMovies() {
  return fetch(BASE_URL)
    .then(res => {
      if (!res.ok) throw new Error('Erreur réseau lors de la récupération de tous les films');
      return res.json();
    });
}

/**
 * Recherche des films dont le titre contient le terme fourni.
 * @param {string} term - Terme de recherche pour filtrer les titres.
 * @returns {Promise<Array>} Promesse résolue avec le tableau des films correspondants.
 */
export function searchMovies(term) {
  return fetch(`${BASE_URL}/search/${encodeURIComponent(term)}`)
    .then(res => {
      if (!res.ok) throw new Error(`Erreur réseau lors de la recherche de films pour : ${term}`);
      return res.json();
    });
}

/**
 * Récupère les détails d'un film spécifique par son identifiant.
 * @param {number|string} id - Identifiant du film.
 * @returns {Promise<Object>} Promesse résolue avec les détails du film.
 */
export function getMovieById(id) {
  return fetch(`${BASE_URL}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error(`Erreur réseau lors de la récupération du film avec ID : ${id}`);
      return res.json();
    });
}


