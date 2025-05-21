import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieById } from "../services/movieService";
import { getUserById, updateUserWatchlist } from "../services/userService";
import Synopsis from "./Synopsis";
import Trailer from "./Trailer";
import FilmInfo from "./FilmInfo";
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

  // 5) Rendu principal
  return (
    <div className="film-detail">
      <Link to="/" className="back-link">
        ← Retour à l’accueil
      </Link>

      <h2>{movie.title}</h2>

      {/* Date de sortie */}
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

      <div className="detail-content">
        <div className="detail-main">
          {movie.overview && <Synopsis text={movie.overview} />}
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
