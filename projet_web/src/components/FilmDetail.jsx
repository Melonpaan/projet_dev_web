import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieById } from "../services/movieService";
import { getUserById, toggleWatchlist } from "../services/userService";
import { useAuth } from "../contexts/AuthContext";
import Synopsis from "./Synopsis";
import Trailer from "./Trailer";
import FilmInfo from "./FilmInfo";
import "./FilmDetail.css";

export default function FilmDetail() {
  const { id } = useParams();
  const userId = 1;
  const { isAuthenticated } = useAuth();

  const [movie, setMovie]               = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [userWatchlist, setUserWatchlist] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleError, setToggleError]     = useState(null);
  const [message, setMessage]             = useState(null);

  // 1) Charger les détails du film
  useEffect(() => {
    setLoading(true);
    getMovieById(id)
      .then(data => {
        setMovie(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger le film");
        setLoading(false);
      });
  }, [id]);

  // 2) Charger la watchlist de l’utilisateur
  useEffect(() => {
    getUserById(userId)
      .then(user => {
        const list = user.watchlist || [];
        setUserWatchlist(list);
        setIsInWatchlist(list.some(m => String(m.id) === id));
      })
      .catch(() => {});
  }, [id]);

  // 3) Basculer l’état watchlist
  async function handleToggle() {
    setMessage(null);
    setToggleLoading(true);
    setToggleError(null);

    // Sauvegarde l’état avant le toggle pour le message
    const wasIn = isInWatchlist;

    try {
      const updated = await toggleWatchlist(userId, {
        id: Number(id),
        title: movie.title,
      });

      setUserWatchlist(updated.watchlist);
      setIsInWatchlist(updated.watchlist.some(m => String(m.id) === id));

      // Affiche un message selon l’action
      setMessage(
        wasIn
          ? "Le film a été retiré de votre liste “À voir”."
          : "Le film a été ajouté à votre liste “À voir”."
      );
    } catch {
      setToggleError("Erreur lors de la mise à jour");
    } finally {
      setToggleLoading(false);
    }
  }

  // 4) États de rendu
  if (loading) return <p>Chargement du film…</p>;
  if (error)   return <p className="error">{error}</p>;

  // 5) Rendu principal
  return (
    <div className="film-detail">
      <Link to="/" className="back-link">
        ← Retour à l’accueil
      </Link>

      <h2>{movie.title}</h2>
      {movie.release_date && (
        <p className="release-date">
          Sorti le{" "}
          {new Date(movie.release_date).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
      <img
        src={movie.posterPath}
        alt={`Affiche de ${movie.title}`}
        className="detail-poster"
      />

      {toggleError && <p className="error">{toggleError}</p>}
      {message     && <p className="info">{message}</p>}

      {isAuthenticated ? (
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
      ) : (
        <Link to="/login" className="watchlist-login-prompt">
          Connectez-vous pour gérer votre liste
        </Link>
      )}

      <div className="detail-content">
        <div className="detail-main">
          {movie.overview  && <Synopsis text={movie.overview} />}
          {movie.trailerUrl && <Trailer url={movie.trailerUrl} />}
        </div>
        <aside className="detail-sidebar">
          <FilmInfo
            director={movie.director}
            status={movie.status}
            budget={movie.budget}
            revenue={movie.revenue}
            productionCompanies={movie.production_companies}
          />
        </aside>
      </div>
    </div>
  );
}

