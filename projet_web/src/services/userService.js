const BASE_URL = "/api/users";

export function getUserById(id) {
  return fetch(`${BASE_URL}/${id}`).then((res) => {
    if (!res.ok) throw new Error("Erreur réseau");
    return res.json();
  });
}

export function updateUserWatchlist(id, watchlist) {
  return fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ watchlist }),
  }).then((res) => {
    if (!res.ok) throw new Error("Erreur réseau");
    return res.json();
  });
}

export function updateUserWatched(id, watched) {
  return fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ watched }),
  }).then((res) => {
    if (!res.ok) throw new Error("Erreur réseau");
    return res.json();
  });
}

/**
 * Toggle a movie in the watchlist:
 * - If the movie is not in watchlist, add it and remove from watched
 * - If the movie is already in watchlist, remove it and add to watched
 */
export async function toggleWatchlist(userId, movie) {
  const user = await getUserById(userId);

  const inWatch = user.watchlist.some((m) => m.id === movie.id);

  const newWatchlist = inWatch
    ? user.watchlist.filter((m) => m.id !== movie.id)
    : [...user.watchlist, movie];

  const newWatched = inWatch
    ? user.watched
    : [...user.watched.filter((m) => m.id !== movie.id)];

  // Update both lists in parallel
  const [resWList, resWatched] = await Promise.all([
    updateUserWatchlist(userId, newWatchlist),
    updateUserWatched(userId, newWatched),
  ]);

  return {
    ...user,
    watchlist: resWList.watchlist,
    watched: resWatched.watched,
  };
}

/**
 * Marquer un film comme vu
 */
export async function markAsWatched(userId, movie) {
  const user = await getUserById(userId);
  // Empêche doublon
  if (user.watched.some((m) => m.id === movie.id)) {
    return user;
  }
  const newWatchlist = user.watchlist.filter((m) => m.id !== movie.id);
  const newWatched = [...user.watched, movie];

  const [resWList, resWatched] = await Promise.all([
    updateUserWatchlist(userId, newWatchlist),
    updateUserWatched(userId, newWatched),
  ]);

  return {
    ...user,
    watchlist: resWList.watchlist,
    watched: resWatched.watched,
  };
}

/**
 * Supprimer un film de la watchlist
 */
export async function removeFromWatchlist(userId, movie) {
  const user = await getUserById(userId);
  const newWatchlist = user.watchlist.filter((m) => m.id !== movie.id);
  const updated = await updateUserWatchlist(userId, newWatchlist);
  return {
    ...user,
    watchlist: updated.watchlist,
    watched: user.watched,
  };
}

/**
 * Supprimer un film de la liste "Vus"
 */
export async function removeFromWatched(userId, movie) {
  const user = await getUserById(userId);
  const newWatched = user.watched.filter((m) => m.id !== movie.id);
  const updated = await updateUserWatched(userId, newWatched);
  return {
    ...user,
    watchlist: user.watchlist,
    watched: updated.watched,
  };
}
