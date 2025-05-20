// src/components/Synopsis.jsx
export default function Synopsis({ text }) {
  return (
    <section className="film-synopsis">
      <h3>Synopsis</h3>
      <p>{text}</p>
    </section>
  );
}
