export default function FilmInfo({
  director,
  status,
  budget,
  revenue,
  productionCompanies
}) {
  return (
    <section className="film-info">
      <h3>Informations</h3>
      <ul>
        <li><strong>Réalisateur :</strong> {director}</li>
        <li><strong>Statut :</strong> {status}</li>
        <li><strong>Budget :</strong> {budget.toLocaleString()} $</li>
        <li><strong>Recettes :</strong> {revenue.toLocaleString()} $</li>
        <li>
          <strong>Sociétés :</strong>
          <ul className="prod-list">
            {productionCompanies.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </li>
      </ul>
    </section>
  );
}
