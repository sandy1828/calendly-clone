import "../styles/style2.css";
export default function SlotList({ slots, onBook }) {
  if (!slots || slots.length === 0) return <p>No slots added yet.</p>;

  return (
    <ul className="space-y-2">
      {slots.map((s, i) => (
        <li
          key={i}
          className="card flex justify-between items-center"
          style={{ padding: "10px 16px" }}
        >
          <span>
            {s.day}: {s.start} - {s.end} ({s.durationMin}m)
          </span>
          {onBook && (
            <button className="btn btn-primary" onClick={() => onBook(s)}>
              Book
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

