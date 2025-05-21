import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

export default function Header({ onSearch }) {
  const { isAuthenticated, logout } = useAuth();
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(term);
    if (location.pathname !== "/") navigate("/");
  }

  return (
    <header className="app-header">
      <div className="logo">
        <Link
          to="/"
          onClick={() => {
            onSearch(""); // reset de la recherche dans App
            setTerm(""); // reset du champ dans Header
          }}
        >
          MovieBinge
        </Link>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Rechercher un film…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      <nav className="main-nav">
        <Link to="/">Accueil</Link>
        <Link to="/profile">Mes listes</Link>
        {isAuthenticated ? (
          <button
            className="login-btn"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Déconnexion
          </button>
        ) : (
          <Link to="/login" className="login-btn">
            Connexion
          </Link>
        )}
      </nav>
    </header>
  );
}
