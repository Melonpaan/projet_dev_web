import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FilmList.css";

export default function FilmList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);

    // si query vide, on prend tous les films, sinon on filtre avec ?q=
    const url = query
      ? `/api/movies?title_like=${encodeURIComponent(query)}`
      : "/api/movies";
    console.log("URL de recherche:", url);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMovies(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger les films");
        setLoading(false);
      });
  }, [query]);

  if (loading) return <p>Chargement des films...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <form
        className="search-form"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(searchTerm);
        }}
      >
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher un film…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button">
          Rechercher
        </button>
        <button
          type="button"
          className="reset-button"
          onClick={() => {
            setSearchTerm("");
            setQuery("");
          }}
        >
          Voir tous
        </button>
      </form>

      <ul className="film-list">
        {movies.map((movie) => (
          <li key={movie.id} className="film-item">
            <Link to={`/movie/${movie.id}`} className="film-link">
              <img
                src={movie.posterUrl}
                alt={`Affiche de ${movie.title}`}
                className="film-poster"
              />
              <p className="film-title">{movie.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
