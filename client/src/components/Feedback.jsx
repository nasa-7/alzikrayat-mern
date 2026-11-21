/** Loading spinner and error alert used by every data-fetching view. */
export function Loading({ label = 'Loading moments...' }) {
  return (
    <div className="spinner-wrap" role="status">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorAlert({ messages }) {
  const list = (Array.isArray(messages) ? messages : [messages]).filter(Boolean);
  if (list.length === 0) return null;
  return (
    <div className="alert alert-danger" role="alert">
      <ul className="mb-0">
        {list.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
