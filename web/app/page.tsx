"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { Book } from "@/lib/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [addingId, setAddingId] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = (await api.books.search(query)) as { books: Book[]; total: number };
      setBooks(res.books);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(book: Book) {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setAddingId(book.googleId);
    try {
      await api.collection.add({
        googleId: book.googleId,
        title: book.title,
        authors: book.authors,
        thumbnail: book.thumbnail,
      });
      setAdded((prev) => new Set(prev).add(book.googleId));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setAddingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Buscar Livros</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: Clean Code, Harry Potter..."
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded p-3 mb-4">{error}</p>
      )}

      <ul className="flex flex-col gap-4">
        {books.map((book) => (
          <li
            key={book.googleId}
            className="bg-white rounded-xl shadow p-4 flex gap-4 items-start"
          >
            {book.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.thumbnail}
                alt={book.title}
                className="w-16 h-24 object-cover rounded shrink-0"
              />
            ) : (
              <div className="w-16 h-24 bg-gray-100 rounded shrink-0 flex items-center justify-center text-gray-400 text-xs">
                sem capa
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-base leading-tight">{book.title}</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {book.authors.length > 0 ? book.authors.join(", ") : "Autor desconhecido"}
              </p>
              {book.publishedDate && (
                <p className="text-xs text-gray-400 mt-0.5">{book.publishedDate}</p>
              )}
              {book.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{book.description}</p>
              )}
            </div>

            <button
              onClick={() => handleAdd(book)}
              disabled={added.has(book.googleId) || addingId === book.googleId}
              className="shrink-0 text-sm px-3 py-1.5 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-default transition-colors"
            >
              {added.has(book.googleId)
                ? "✓ Adicionado"
                : addingId === book.googleId
                ? "..."
                : "+ Coleção"}
            </button>
          </li>
        ))}
      </ul>

      {books.length === 0 && !loading && (
        <p className="text-gray-400 text-sm text-center mt-12">
          Busque por um título, autor ou ISBN para encontrar livros.
        </p>
      )}
    </div>
  );
}
