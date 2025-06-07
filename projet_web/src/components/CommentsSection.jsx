import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getComments, addComment, updateComment, deleteComment } from '../services/commentService';
import './CommentsSection.css';

/**
 * Composant pour gérer les commentaires d'un film :
 * - affichage des commentaires
 * - ajout d'un nouveau commentaire
 * - édition et suppression pour le propre utilisateur
 */
export default function CommentsSection({ movieId }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  // Charge les commentaires pour le film
  useEffect(() => {
    setLoading(true);
    getComments(movieId)
      .then(data => setComments(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [movieId]);

  // Rafraîchit la liste après action
  async function reload() {
    setLoading(true);
    try {
      const data = await getComments(movieId);
      setComments(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newContent.trim()) return;
    try {
      await addComment({ userId: user.id, movieId, content: newContent.trim() });
      setNewContent('');
      await reload();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(comment) {
    setEditingId(comment.id);
    setEditingContent(comment.content);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await updateComment({ id: editingId, content: editingContent.trim() });
      setEditingId(null);
      setEditingContent('');
      await reload();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteComment(id);
      await reload();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="comments-section">
      <h3>Commentaires</h3>
      {loading ? (
        <p>Chargement…</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : comments.length === 0 ? (
        <p>Aucun commentaire pour ce film.</p>
      ) : (
        <ul className="comment-list">
          {comments.map(c => (
            <li key={c.id} className="comment-item">
              <p><strong>{c.username}</strong> <em>le {new Date(c.createdAt).toLocaleDateString()}</em></p>
              {editingId === c.id ? (
                <form onSubmit={handleUpdate} className="edit-form">
                  <textarea
                    value={editingContent}
                    onChange={e => setEditingContent(e.target.value)}
                  />
                  <button type="submit">Enregistrer</button>
                  <button type="button" onClick={() => setEditingId(null)}>Annuler</button>
                </form>
              ) : (
                <p>{c.content}</p>
              )}
              {isAuthenticated && c.userId === user.id && editingId !== c.id && (
                <div className="actions">
                  <button onClick={() => startEdit(c)}>Éditer</button>
                  <button onClick={() => handleDelete(c.id)}>Supprimer</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {isAuthenticated && (
        <form onSubmit={handleAdd} className="add-form">
          <textarea
            placeholder="Nouveau commentaire…"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
          />
          <button type="submit" disabled={!newContent.trim()}>Publier</button>
        </form>
      )}
    </section>
  );
} 