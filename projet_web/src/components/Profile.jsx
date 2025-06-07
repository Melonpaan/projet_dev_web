import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserById,
  moveToWatched,
  moveToWatchlist,
  removeFromWatchlist,
  removeFromWatched,
} from "../services/userService";
import Tabs from "./Tabs";
import "./Profile.css";

export default function Profile() {
  const userId = 1;
  const navigate = useNavigate();

  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [message, setMessage] = useState(null);

  // Chargement initial
  useEffect(() => {
    setLoading(true);
    getUserById(userId)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger le profil");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement du profil…</p>;
  if (error)   return <p className="error">{error}</p>;

  // 1) Marquer comme vu
  const handleMarkWatched = async movie => {
    try {
      // Déplace de « À voir » vers « Vus »
      const updated = await moveToWatched(userId, movie.id);
      setUser(updated);
      setMessage('Le film a été marqué comme vu.');
    } catch {
      setError("Erreur lors de la mise à jour");
    }
  };

  // 2) Déplacer de « Vus » vers « À voir »
  const handleToggleWatchlist = async movie => {
    setMessage(null);
    try {
      const updated = await moveToWatchlist(userId, movie.id);
      setUser(updated);
      setMessage('Le film a été déplacé vers la liste « À voir ».');
    } catch {
      setError("Erreur lors de la mise à jour");
    }
  };

  // 3) Supprimer de la watchlist
  const handleRemoveFromWatchlist = async movie => {
    try {
      const updated = await removeFromWatchlist(userId, movie.id);
      setUser(updated);
      setMessage('Le film a été retiré de votre liste « À voir ».');
    } catch {
      setError("Erreur lors de la suppression");
    }
  };

  // 4) Supprimer de la liste « Vus »
  const handleRemoveFromWatched = async movie => {
    try {
      const updated = await removeFromWatched(userId, movie.id);
      setUser(updated);
      setMessage('Le film a été retiré de votre liste « Vus ».');
    } catch {
      setError("Erreur lors de la suppression");
    }
  };

  const tabs = [
    {
      id: "watchlist",
      label: "À voir",
      content: user.watchlist.length === 0 ? (
        <EmptyState label="À voir" onBrowse={() => navigate("/")} />
      ) : (
        <>
          {message && <p className="info">{message}</p>}
          <ul className="watchlist">
            {user.watchlist.map(movie => (
              <li key={movie.id}>
                {movie.title}
                <button onClick={() => handleMarkWatched(movie)}>
                  Marquer comme vu
                </button>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromWatchlist(movie)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: "watched",
      label: "Vus",
      content: user.watched.length === 0 ? (
        <EmptyState label="Vus" onBrowse={() => navigate("/")} />
      ) : (
        <>
          {message && <p className="info">{message}</p>}
          <ul className="watchlist">
            {user.watched.map(movie => (
              <li key={movie.id}>
                {movie.title}
                <button onClick={() => handleToggleWatchlist(movie)}>
                  Remettre à voir
                </button>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFromWatched(movie)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className="profile">
      <h2>Bienvenue, {user.username}</h2>
      <Tabs tabs={tabs} />
    </div>
  );
}

function EmptyState({ label, onBrowse }) {
  return (
    <div className="empty-state">
      <p>Aucun film dans la liste "{label}".</p>
      <button onClick={onBrowse}>Parcourir les films</button>
    </div>
  );
}

