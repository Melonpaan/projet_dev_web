// Services pour la gestion des commentaires via l'API

const COMMENT_BASE_URL = '/api/comments';

/**
 * Récupère tous les commentaires associés à un film.
 * @param {number} movieId - Identifiant du film.
 * @returns {Promise<object[]>} Promesse résolue avec un tableau de Comment.
 */
export async function getComments(movieId) {
  const res = await fetch(COMMENT_BASE_URL);
  if (!res.ok) throw new Error('Erreur réseau lors de la récupération des commentaires.');
  const comments = await res.json();
  return comments.filter(c => c.movieId === movieId);
}

/**
 * Ajoute un nouveau commentaire pour un film.
 * @param {{ userId: number, movieId: number, content: string }} data - Données du commentaire.
 * @returns {Promise<void>} Promesse résolue lorsque le commentaire est créé.
 */
export async function addComment({ userId, movieId, content }) {
  const res = await fetch(COMMENT_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, movieId, content }),
  });
  if (!res.ok) throw new Error("Erreur lors de l'ajout du commentaire.");
}

/**
 * Met à jour un commentaire existant.
 * @param {{ id: number, content: string }} data - Identifiant et nouveau contenu.
 * @returns {Promise<void>} Promesse résolue lorsque la mise à jour est effectuée.
 */
export async function updateComment({ id, content }) {
  const res = await fetch(`${COMMENT_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, content }),
  });
  if (!res.ok) throw new Error("Erreur lors de la modification du commentaire.");
}

/**
 * Supprime un commentaire.
 * @param {number} commentId - Identifiant du commentaire.
 * @returns {Promise<void>} Promesse résolue lorsque le commentaire est supprimé.
 */
export async function deleteComment(commentId) {
  const res = await fetch(`${COMMENT_BASE_URL}/${commentId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression du commentaire.");
} 