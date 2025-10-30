import React, { useState, useRef } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);

  async function fetchBooks() {
    if (!query.trim()) return;

    // Cancel any previous request
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);

    try {
      const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(
        query
      )}`;
      const res = await fetch(url, { signal: controller.signal });
      const data = await res.json();
      setResults(data.docs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetchBooks();
  }

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1>📚 Book Finder</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a book..."
          style={{ padding: 8, width: "60%" }}
        />
        <button type="submit" style={{ padding: 8, marginLeft: 8 }}>
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}

      <ul>
        {results.slice(0, 10).map((book) => (
          <li key={book.key}>
            <strong>{book.title}</strong> — {book.author_name?.[0] || "Unknown"}
          </li>
        ))}
      </ul>
    </div>
  );
}
