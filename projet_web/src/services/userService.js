import { authFetch } from './api';

const USER_BASE_URL = "/api/users";
const USER_LIST_BASE_URL = "/api/userlist";

/**
 * Récupère l'utilisateur par son ID, incluant :
 * - ses informations (username, email)
 * - sa watchlist (films à voir)
 * - sa liste des films vus
 *
 * Cette fonction :
 * 1. Récupère tous les utilisateurs via GET /api/users et filtre par userId.
 * 2. Récupère la liste "to_watch" et transforme en array de Movie.
 * 3. Récupère la liste "watched" et transforme en array de Movie.
 *
 * @param {number} userId - Identifiant de l'utilisateur.
 * @returns {Promise<{ id: number, username: string, email: string, watchlist: Movie[], watched: Movie[] }>}
 */
export async function getUserById(userId) {
  // Étape 1: Récupérer les détails de l'utilisateur (nom, etc.)
  const usersResponse = await authFetch(USER_BASE_URL);
  if (!usersResponse.ok) throw new Error("Erreur réseau lors de la récupération des utilisateurs.");
  const users = await usersResponse.json();
  const user = users.find(u => u.id === userId);

  if (!user) throw new Error(`Utilisateur avec ID ${userId} non trouvé.`);

  // Étape 2: Récupérer la watchlist (to_watch)
  const watchlistResponse = await authFetch(`${USER_LIST_BASE_URL}/to_watch`);
  if (!watchlistResponse.ok) throw new Error("Erreur réseau lors de la récupération de la watchlist.");
  const watchlistItems = await watchlistResponse.json(); // Ce sont des UserList[]

  // Étape 3: Récupérer la liste des vus (watched)
  const watchedResponse = await authFetch(`${USER_LIST_BASE_URL}/watched`);
  if (!watchedResponse.ok) throw new Error("Erreur réseau lors de la récupération de la liste des vus.");
  const watchedItems = await watchedResponse.json(); // Ce sont des UserList[]

  // Les UserListItems contiennent { id, userId, movieId, status, movie { id, title... } }
  // Nous devons extraire les objets `movie` pour correspondre à la structure attendue par le reste du frontend.
  const watchlist = watchlistItems.map(item => item.movie);
  const watched = watchedItems.map(item => item.movie);
  
  return {
    ...user, // Contient id, name, email de l'utilisateur
    watchlist, // Liste de films
    watched    // Liste de films
  };
}

/**
 * Ajoute un film à la liste "À voir" de l'utilisateur.
 *
 * @param {number} userId - Identifiant de l'utilisateur.
 * @param {number} movieId - Identifiant du film.
 * @returns {Promise<object>} - L'utilisateur mis à jour.
 */
export async function addToWatchlist(userId, movieId) {
  await authFetch(`${USER_LIST_BASE_URL}/to_watch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movieId }),
  });
  return getUserById(userId);
}

/**
 * Retire un film de la liste "À voir" de l'utilisateur.
 *
 * @param {number} userId - Identifiant de l'utilisateur.
 * @param {number} movieId - Identifiant du film.
 * @returns {Promise<object>} - L'utilisateur mis à jour.
 */
export async function removeFromWatchlist(userId, movieId) {
  const response = await authFetch(`${USER_LIST_BASE_URL}/to_watch`);
  if (!response.ok) throw new Error('Erreur lors de la suppression de la watchlist.');
  const items = await response.json();
  const entry = items.find(item => item.movieId === movieId);
  if (entry) {
    await authFetch(`${USER_LIST_BASE_URL}/${entry.id}`, { method: 'DELETE' });
  }
  return getUserById(userId);
}

/**
 * Ajoute un film à la liste "Vus" de l'utilisateur.
 *
 * @param {number} userId - Identifiant de l'utilisateur.
 * @param {number} movieId - Identifiant du film.
 * @returns {Promise<object>} - L'utilisateur mis à jour.
 */
export async function addToWatched(userId, movieId) {
  await authFetch(`${USER_LIST_BASE_URL}/watched`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movieId }),
  });
  return getUserById(userId);
}

/**
 * Retire un film de la liste "Vus" de l'utilisateur.
 *
 * @param {number} userId - Identifiant de l'utilisateur.
 * @param {number} movieId - Identifiant du film.
 * @returns {Promise<object>} - L'utilisateur mis à jour.
 */
export async function removeFromWatched(userId, movieId) {
  const response = await authFetch(`${USER_LIST_BASE_URL}/watched`);
  if (!response.ok) throw new Error('Erreur lors de la suppression de la liste Vus.');
  const items = await response.json();
  const entry = items.find(item => item.movieId === movieId);
  if (entry) {
    await authFetch(`${USER_LIST_BASE_URL}/${entry.id}`, { method: 'DELETE' });
  }
  return getUserById(userId);
}

/**
 * Déplace un film de "À voir" vers "Vus".
 *
 * @param {number} userId - Identifiant de l'utilisateur.
 * @param {number} movieId - Identifiant du film.
 * @returns {Promise<object>} - L'utilisateur mis à jour.
 */
export async function moveToWatched(userId, movieId) {
  // Récupère l'entrée existante dans "À voir"
  const listRes = await authFetch(`${USER_LIST_BASE_URL}/to_watch`);
  if (!listRes.ok) throw new Error("Erreur réseau lors de la récupération de la watchlist.");
  const items = await listRes.json();
  const entry = items.find(item => item.movieId === movieId);
  if (!entry) throw new Error("Film non trouvé dans la liste à voir.");
  // Met à jour le statut via PUT
  const updateRes = await authFetch(`${USER_LIST_BASE_URL}/${entry.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'watched' }),
  });
  if (!updateRes.ok) throw new Error("Erreur lors de la mise à jour du statut.");
  return getUserById(userId);
}

/**
 * Déplace un film de "Vus" vers "À voir".
 *
 * @param {number} userId - Identifiant de l'utilisateur.
 * @param {number} movieId - Identifiant du film.
 * @returns {Promise<object>} - L'utilisateur mis à jour.
 */
export async function moveToWatchlist(userId, movieId) {
  // Récupère l'entrée existante dans "Vus"
  const listRes = await authFetch(`${USER_LIST_BASE_URL}/watched`);
  if (!listRes.ok) throw new Error("Erreur réseau lors de la récupération de la liste des vus.");
  const items = await listRes.json();
  const entry = items.find(item => item.movieId === movieId);
  if (!entry) throw new Error("Film non trouvé dans la liste des vus.");
  // Met à jour le statut via PUT
  const updateRes = await authFetch(`${USER_LIST_BASE_URL}/${entry.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'to_watch' }),
  });
  if (!updateRes.ok) throw new Error("Erreur lors de la mise à jour du statut.");
  return getUserById(userId);
}

/**
 * Enregistre un nouvel utilisateur.
 *
 * @param {{ username: string, email: string, password: string, confirmPassword: string, firstName: string, lastName: string, dateOfBirth: string }} userData
 * @returns {Promise<object>} - Message de confirmation du backend.
 */
export function registerUser({ username, email, password, confirmPassword, firstName, lastName, dateOfBirth }) {
  return fetch('/api/users/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username, email, password, confirmPassword, firstName, lastName, dateOfBirth })
  }).then(res => {
    if (!res.ok) throw new Error('Échec inscription');
    return res.json(); // { message: ... }
  });
}

/**
 * Authentifie un utilisateur existant.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<object>} - L'utilisateur authentifié sous forme d'objet contenant le token.
 */
export function authenticate({ email, password }) {
  return fetch('/api/users/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(res => {
    if (res.status === 401) throw new Error('Identifiants invalides');
    if (!res.ok) throw new Error('Erreur réseau');
    return res.json(); // { id, username, email, ... }
  });
}
