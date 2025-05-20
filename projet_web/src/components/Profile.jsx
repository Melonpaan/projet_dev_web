// src/components/Profile.jsx
import { useState, useEffect } from "react";
import { getUserById } from "../services/userService";
import "./Profile.css"; // à créer si tu veux des styles

export default function Profile() {
  const userId = 1;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUserById(userId)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger le profil");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement du profil…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="profile">
      <h2>Bienvenue, {user.username}</h2>

      <h3>Ma watchlist</h3>
      {user.watchlist.length === 0 ? (
        <p>Votre watchlist est vide.</p>
      ) : (
        <ul className="watchlist">
          {user.watchlist.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
