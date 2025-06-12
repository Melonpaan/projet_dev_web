import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <p className="error">{error}</p>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Se connecter</button>
        <p>Pas encore inscrit ? <Link to="/register">Inscription</Link></p>
      </form>
    </div>
  );
}
