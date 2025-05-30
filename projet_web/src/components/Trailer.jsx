export default function Trailer({ url }) {
  if (!url) return null;

  // Extraire l'ID de la vidéo depuis l'URL YouTube
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const videoId = match ? match[1] : null;

  if (!videoId) {
    return <p>Vidéo YouTube non valide</p>;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <section className="film-trailer">
      <h3>Bande-annonce</h3>
      <div className="trailer-container">
        <iframe
          width="560"
          height="315"
          src={embedUrl}
          title="Bande-annonce"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}
