import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllMovies } from "../services/movieService";
import "./FilmList.css";

export default function FilmList({ initialQuery = "" }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState(initialQuery);

  // Met à jour la requête si initialQuery change depuis le Header
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Charge tous les films puis filtre côté client
  useEffect(() => {
    setLoading(true);
    setError(null);

    getAllMovies()
      .then((data) => {
        const filtered = query
          ? data.filter((movie) =>
              movie.title.toLowerCase().includes(query.toLowerCase())
            )
          : data;
        setMovies(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger les films");
        setLoading(false);
      });
  }, [query]);

  if (loading) return <p>Chargement des films...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!loading && movies.length === 0)
    return <p className="no-results">Aucun film trouvé pour « {query} »</p>;

  return (
    <ul className="film-list">
      {movies.map((movie) => (
        <li key={movie.id} className="film-item">
          <Link to={`/movie/${movie.id}`} className="film-link">
            <img
              src={movie.posterPath}
              alt={`Affiche de ${movie.title}`}
              className="film-poster"
            />
            <p className="film-title">{movie.title}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
