import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieById } from "../services/movieService";
import { getUserById, updateUserWatchlist } from "../services/userService";
import "./FilmDetail.css";

export default function FilmDetail() {
  const { id } = useParams();
  const userId = 1;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userWatchlist, setUserWatchlist] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleError, setToggleError] = useState(null);

  // 1) Charger les détails du film
  useEffect(() => {
    setLoading(true);
    getMovieById(id)
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger le film");
        setLoading(false);
      });
  }, [id]);

  // 2) Charger la watchlist de l’utilisateur
  useEffect(() => {
    getUserById(userId)
      .then((user) => {
        const list = user.watchlist || [];
        setUserWatchlist(list);
        setIsInWatchlist(list.some((m) => String(m.id) === id));
      })
      .catch((err) => {
        console.error(err);
        // pas de setError ici pour ne pas bloquer l'affichage du film
      });
  }, [id]);

  // 3) Basculer l’état watchlist
  function handleToggle() {
    setToggleLoading(true);
    setToggleError(null);

    const newList = isInWatchlist
      ? userWatchlist.filter((m) => String(m.id) !== id)
      : [...userWatchlist, { id: Number(id), title: movie.title }];

    updateUserWatchlist(userId, newList)
      .then((updatedUser) => {
        setUserWatchlist(updatedUser.watchlist);
        setIsInWatchlist(!isInWatchlist);
      })
      .catch((err) => {
        console.error(err);
        setToggleError("Erreur lors de la mise à jour");
      })
      .finally(() => setToggleLoading(false));
  }

  // 4) États de rendu
  if (loading) return <p>Chargement du film…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="film-detail">
      <Link to="/" className="back-link">
        ← Retour à l’accueil
      </Link>
      <h2>{movie.title}</h2>
      <img
        src={movie.posterUrl}
        alt={`Affiche de ${movie.title}`}
        className="detail-poster"
      />

      {toggleError && <p className="error">{toggleError}</p>}

      <button
        onClick={handleToggle}
        disabled={toggleLoading}
        className="watchlist-btn"
      >
        {toggleLoading
          ? "…"
          : isInWatchlist
          ? "Retirer de ma watchlist"
          : "Ajouter à ma watchlist"}
      </button>
    </div>
  );
}
