import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, updateUserWatchlist, updateUserWatched } from "../services/userService";
import Tabs from "./Tabs";
import "./Profile.css";

export default function Profile() {
  const userId = 1;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUserById(userId)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Impossible de charger le profil");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement du profil…</p>;
  if (error)   return <p className="error">{error}</p>;

  const handleMarkWatched = movie => {
    const newWatchlist = user.watchlist.filter(m => m.id !== movie.id);
    const newWatched = [...user.watched, movie];
    // Mettre à jour côté serveur
    updateUserWatchlist(userId, newWatchlist).then(() => {});
    updateUserWatched(userId, newWatched).then(updated => {
      setUser(prev => ({ ...prev, watchlist: newWatchlist, watched: updated.watched }));
    });
  };

  const handleUnmarkWatched = movie => {
    const newWatched = user.watched.filter(m => m.id !== movie.id);
    // simple update
    updateUserWatched(userId, newWatched).then(updated => {
      setUser(prev => ({ ...prev, watched: updated.watched }));
    });
  };

  const tabs = [
    {
      id: "watchlist",
      label: "À voir",
      content: user.watchlist.length === 0 ? (
        <EmptyState label="À voir" onBrowse={() => navigate("/")} />
      ) : (
        <ul className="watchlist">
          {user.watchlist.map(movie => (
            <li key={movie.id}>
              {movie.title}
              <button onClick={() => handleMarkWatched(movie)}>Marqué comme vu</button>
            </li>
          ))}
        </ul>
      )
    },
    {
      id: "watched",
      label: "Vus",
      content: user.watched.length === 0 ? (
        <EmptyState label="Vus" onBrowse={() => navigate("/")} />
      ) : (
        <ul className="watchlist">
          {user.watched.map(movie => (
            <li key={movie.id}>
              {movie.title}
              <button onClick={() => handleUnmarkWatched(movie)}>Retirer</button>
            </li>
          ))}
        </ul>
      )
    }
  ];

  return (
    <div className="profile">
      <h2>Bienvenue, {user.username}</h2>
      <Tabs tabs={tabs} />
    </div>
  );
}

// Composant interne pour afficher l'état vide
function EmptyState({ label, onBrowse }) {
  return (
    <div className="empty-state">
      <p>Aucun film dans la liste “{label}”.</p>
      <button onClick={onBrowse}>Parcourir les films</button>
    </div>
  );
}


