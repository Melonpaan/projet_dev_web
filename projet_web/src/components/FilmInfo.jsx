export default function FilmInfo({ title, releaseDate, revenue, overview, youtubeUrl }) {
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
