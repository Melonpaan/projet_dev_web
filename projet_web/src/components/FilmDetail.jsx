import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./FilmDetail.css";

export default function FilmDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userWatchlist, setUserWatchlist] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleError, setToggleError] = useState(null);

  // 1) fetch du film
  useEffect(() => {
    fetch(`/api/movies/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
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

  // 2) fetch de la watchlist utilisateur
  useEffect(() => {
    fetch("/api/user")
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((data) => {
        setUserWatchlist(data.watchlist || []);
        setIsInWatchlist(data.watchlist.some((m) => String(m.id) === id));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  // 3) fonction de toggle watchlist
  function handleToggle() {
    setToggleLoading(true);
    setToggleError(null);

    const newWatchlist = isInWatchlist
      ? userWatchlist.filter((m) => String(m.id) !== id)
      : [...userWatchlist, { id: Number(id), title: movie.title }];

    fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ watchlist: newWatchlist }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then((data) => {
        setUserWatchlist(data.watchlist);
        setIsInWatchlist(!isInWatchlist);
      })
      .catch((err) => {
        console.error(err);
        setToggleError("Erreur lors de la mise à jour");
      })
      .finally(() => {
        setToggleLoading(false);
      });
  }

  // 4) rendus conditionnels
  if (loading) return <p>Chargement du film…</p>;
  if (error) return <p>{error}</p>;

  // 5) rendu principal
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
      {/* Plus tard : ajouter synopsis, date, bouton watchlist, etc. */}
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
