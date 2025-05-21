import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import FilmList from "./components/FilmList";
import FilmDetail from "./components/FilmDetail";
import Profile from "./components/Profile";
import Login from "./components/Login";

export default function App() {
  const [query, setQuery] = useState(""); // état pour la recherche

  return (
    <div>
      {/* Header */}
      <Header onSearch={(term) => setQuery(term)} />

      <Routes>
        {/*Transmission query à FilmList */}
        <Route path="/" element={<FilmList initialQuery={query} />} />
        <Route path="/movie/:id" element={<FilmDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
