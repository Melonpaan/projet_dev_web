import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import FilmList from "./components/FilmList";
import FilmDetail from "./components/FilmDetail";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute"; 
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  const [query, setQuery] = useState(""); 

  return (
    <AuthProvider>
      <div>
        {/* Header */}
        <Header onSearch={(term) => setQuery(term)} />

        <Routes>
          {/* Transmission query à FilmList */}
          <Route path="/" element={<FilmList initialQuery={query} />} />
          <Route path="/movie/:id" element={<FilmDetail />} />

          {/* Route protégée */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
