import "./App.css";
import { Routes, Route, Link } from 'react-router-dom'
import FilmList from "./components/FilmList";
import FilmDetail from './components/FilmDetail';
import Profile from './components/Profile'

export default function App() {
  return (
    <div>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Accueil</Link>
        <Link to="/profile">Profil</Link>
      </nav>

      <Routes>
        <Route path="/" element={<FilmList />} />
        <Route path="/movie/:id" element={<FilmDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  )
}
