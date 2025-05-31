const USER_BASE_URL = "/api/users";
const USER_LIST_BASE_URL = "/api/userlist";

export async function getUserById(userId) {
  // Étape 1: Récupérer les détails de l'utilisateur (nom, etc.)
  // Actuellement, il n'y a pas d'endpoint direct GET /api/users/{id}
  // Donc, on récupère tous les utilisateurs et on filtre.
  // Ce n'est pas idéal pour la performance si beaucoup d'utilisateurs.
  // Une meilleure solution serait d'ajouter un endpoint GET /api/users/{id} au backend.
  const usersResponse = await fetch(USER_BASE_URL);
  if (!usersResponse.ok) throw new Error("Erreur réseau lors de la récupération des utilisateurs.");
  const users = await usersResponse.json();
  const user = users.find(u => u.id === userId);

  if (!user) throw new Error(`Utilisateur avec ID ${userId} non trouvé.`);

  // Étape 2: Récupérer la watchlist (to_watch)
  const watchlistResponse = await fetch(`${USER_LIST_BASE_URL}/to_watch/${userId}`);
  if (!watchlistResponse.ok) throw new Error("Erreur réseau lors de la récupération de la watchlist.");
  const watchlistItems = await watchlistResponse.json(); // Ce sont des UserList[]

  // Étape 3: Récupérer la liste des vus (watched)
  const watchedResponse = await fetch(`${USER_LIST_BASE_URL}/watched/${userId}`);
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
 * Toggle a movie in the watchlist:
 * - If the movie is not in watchlist, add it and remove from watched
 * - If the movie is already in watchlist, remove it and add to watched
 */
export async function toggleWatchlist(userId, movie) {
  const user = await getUserById(userId); // Récupère l'état actuel

  const isMovieInWatchlist = user.watchlist.some((m) => m.id === movie.id);

  if (isMovieInWatchlist) {
    // Le film est dans la watchlist -> le passer à watched
    // 1. Trouver l'ID de l'entrée UserList pour le supprimer de to_watch
    const watchlistItemsResponse = await fetch(`${USER_LIST_BASE_URL}/to_watch/${userId}`);
    const watchlistItems = await watchlistItemsResponse.json();
    const userListEntry = watchlistItems.find(item => item.movieId === movie.id);
    if (userListEntry) {
      await fetch(`${USER_LIST_BASE_URL}/${userListEntry.id}`, { method: 'DELETE' });
    }
    // 2. Ajouter à watched
    await fetch(`${USER_LIST_BASE_URL}/watched`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, movieId: movie.id, status: 'watched' }),
    });
  } else {
    // Le film n'est pas dans la watchlist -> l'ajouter à watchlist
    // 1. Ajouter à to_watch
    await fetch(`${USER_LIST_BASE_URL}/to_watch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, movieId: movie.id, status: 'to_watch' }),
    });
    // 2. S'il était dans watched, le supprimer de watched
    const watchedItemsResponse = await fetch(`${USER_LIST_BASE_URL}/watched/${userId}`);
    const watchedItems = await watchedItemsResponse.json();
    const userListEntry = watchedItems.find(item => item.movieId === movie.id);
    if (userListEntry) {
      await fetch(`${USER_LIST_BASE_URL}/${userListEntry.id}`, { method: 'DELETE' });
    }
  }
  return getUserById(userId); // Retourner l'état mis à jour
}

/**
 * Marquer un film comme vu
 */
export async function markAsWatched(userId, movie) {
  // 1. Ajouter à la liste "watched"
  await fetch(`${USER_LIST_BASE_URL}/watched`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, movieId: movie.id, status: 'watched' }),
  });

  // 2. Si le film était dans "to_watch", le supprimer
  const watchlistItemsResponse = await fetch(`${USER_LIST_BASE_URL}/to_watch/${userId}`);
  if (watchlistItemsResponse.ok) {
    const watchlistItems = await watchlistItemsResponse.json();
    const userListEntry = watchlistItems.find(item => item.movieId === movie.id);
    if (userListEntry) {
      await fetch(`${USER_LIST_BASE_URL}/${userListEntry.id}`, { method: 'DELETE' });
    }
  }
  return getUserById(userId); // Retourner l'état mis à jour
}

/**
 * Supprimer un film de la watchlist
 */
export async function removeFromWatchlist(userId, movie) {
  const watchlistItemsResponse = await fetch(`${USER_LIST_BASE_URL}/to_watch/${userId}`);
  if (!watchlistItemsResponse.ok) throw new Error("Erreur lors de la récupération de la watchlist pour suppression.");
  const watchlistItems = await watchlistItemsResponse.json();
  const userListEntry = watchlistItems.find(item => item.movieId === movie.id);

  if (userListEntry) {
    await fetch(`${USER_LIST_BASE_URL}/${userListEntry.id}`, { method: 'DELETE' });
  }
  return getUserById(userId); // Retourner l'état mis à jour
}

/**
 * Supprimer un film de la liste "Vus"
 */
export async function removeFromWatched(userId, movie) {
  const watchedItemsResponse = await fetch(`${USER_LIST_BASE_URL}/watched/${userId}`);
  if (!watchedItemsResponse.ok) throw new Error("Erreur lors de la récupération de la liste des vus pour suppression.");
  const watchedItems = await watchedItemsResponse.json();
  const userListEntry = watchedItems.find(item => item.movieId === movie.id);

  if (userListEntry) {
    await fetch(`${USER_LIST_BASE_URL}/${userListEntry.id}`, { method: 'DELETE' });
  }
  return getUserById(userId); // Retourner l'état mis à jour
}

// Les fonctions updateUserWatchlist et updateUserWatched ne sont plus nécessaires
// car les opérations sont maintenant plus granulaires.
// Je les commente pour l'instant.

// export function updateUserWatchlist(id, watchlist) {
//   return fetch(`${USER_BASE_URL}/${id}`, {  // Note: USER_BASE_URL et non USER_LIST_BASE_URL
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ watchlist }),
//   }).then((res) => {
//     if (!res.ok) throw new Error("Erreur réseau");
//     return res.json();
//   });
// }

// export function updateUserWatched(id, watched) {
//   return fetch(`${USER_BASE_URL}/${id}`, { // Note: USER_BASE_URL et non USER_LIST_BASE_URL
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ watched }),
//   }).then((res) => {
//     if (!res.ok) throw new Error("Erreur réseau");
//     return res.json();
//   });
// }

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

export function authenticate({ username, password }) {
  return fetch('/api/users/auth', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username, password })
  })
  .then(res => {
    if (res.status === 401) throw new Error('Identifiants invalides');
    if (!res.ok) throw new Error('Erreur réseau');
    return res.json(); // { id, username, email, ... }
  });
}
