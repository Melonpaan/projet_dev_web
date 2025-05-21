export default function Trailer({ url }) {
  if (!url) return null;
  return (
    <section className="film-trailer">
      <h3>Bande-annonce</h3>
      <div className="trailer-container">
        <iframe
          src={url}
          title="Bande-annonce"
          allow="accelerometer; autoplay;clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}
