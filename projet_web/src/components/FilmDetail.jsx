import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieById } from "../services/movieService";
import { getUserById, addToWatchlist, removeFromWatchlist } from "../services/userService";
import { useAuth } from "../contexts/AuthContext";
import Synopsis from "./Synopsis";
import Trailer from "./Trailer";
import FilmInfo from "./FilmInfo";
import CommentsSection from "./CommentsSection";
import "./FilmDetail.css";

export default function FilmDetail() {
  const { id } = useParams();
  const { user: authUser, isAuthenticated } = useAuth();
  const userId = authUser?.id;

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

  // 2) Charger la watchlist de l'utilisateur si connecté
  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    getUserById(userId)
      .then(user => {
        const list = user.watchlist || [];
        setUserWatchlist(list);
        setIsInWatchlist(list.some(m => String(m.id) === id));
      })
      .catch(() => {});
  }, [id, isAuthenticated, userId]);

  // 3) Basculer l'état watchlist
  async function handleToggle() {
    setMessage(null);
    setToggleLoading(true);
    setToggleError(null);

    // Sauvegarde l'état avant le toggle pour le message
    const wasIn = isInWatchlist;

    try {
      let updated;
      if (wasIn) {
        updated = await removeFromWatchlist(userId, Number(id));
      } else {
        updated = await addToWatchlist(userId, Number(id));
      }

      setUserWatchlist(updated.watchlist);
      setIsInWatchlist(updated.watchlist.some(m => m.id === Number(id)));

      // Affiche un message selon l'action
      setMessage(
        wasIn
          ? 'Le film a été retiré de votre liste « À voir ».'
          : 'Le film a été ajouté à votre liste « À voir ».'
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
      {/* Contenu principal avec fond blanc */}
      <div className="film-detail-content">
        {/* Image de fond */}
        {movie.backdropPath && (
          <div className="backdrop-wrapper">
            <img src={movie.backdropPath} alt="Backdrop" className="backdrop-image" />
          </div>
        )}
        <Link to="/" className="back-link">
          ← Retour à l'accueil
        </Link>

        <h2>{movie.title}</h2>
        {movie.releaseDate && (
          <p className="release-date">
            Sorti le{" "}
            {new Date(movie.releaseDate).toLocaleDateString("fr-FR", {
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
            {movie.youtubeUrl && <Trailer url={movie.youtubeUrl} />}
          </div>
          <aside className="detail-sidebar">
            <FilmInfo
              title={movie.title}
              releaseDate={movie.releaseDate}
              runtime={movie.runtime}
              voteAverageTopRated={movie.voteAverageTopRated}
              genres={movie.genres}
              revenue={movie.revenue}
              overview={movie.overview}
              youtubeUrl={movie.youtubeUrl}
            />
          </aside>
        </div>

        {/* Section des commentaires */}
        <CommentsSection movieId={movie.id} />
      </div>
    </div>
  );
}

