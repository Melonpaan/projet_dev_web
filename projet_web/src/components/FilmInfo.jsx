export default function FilmInfo({ title, releaseDate, runtime, voteAverageTopRated, genres, revenue, overview, youtubeUrl }) {
  return (
    <section className="film-info">
      <h3>Informations</h3>
      <ul>
        <li><strong>Titre :</strong> {title}</li>
        {releaseDate && (
          <li>
            <strong>Date de sortie :</strong>{" "}
            {new Date(releaseDate).toLocaleDateString("fr-FR")}
          </li>
        )}
        {genres && genres.length > 0 && (
          <li>
            <strong>Genres :</strong> {genres.map(g => g.name).join(", ")}
          </li>
        )}
        {typeof runtime === "number" && (
          <li>
            <strong>Durée :</strong> {runtime} min
          </li>
        )}
        {typeof voteAverageTopRated === "number" && (
          <li>
            <strong>Note moyenne :</strong> {voteAverageTopRated.toFixed(1)} / 10
          </li>
        )}
        {typeof revenue === "number" && (
          <li>
            <strong>Recettes :</strong> {revenue.toLocaleString()} $
          </li>
        )}
        {overview && (
          <li>
            <strong>Résumé :</strong> {overview}
          </li>
        )}
        {youtubeUrl && (
          <li>
            <strong>Bande-annonce :</strong>{" "}
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
              Voir sur YouTube
            </a>
          </li>
        )}
      </ul>
    </section>
  );
}
