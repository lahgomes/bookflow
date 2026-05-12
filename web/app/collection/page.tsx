"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { CollectionItem, CollectionStatus } from "@/lib/types";

const STATUS_LABELS: Record<CollectionStatus, string> = {
  want_to_read: "Quero ler",
  reading: "Lendo",
  read: "Lido",
};

const STATUS_COLORS: Record<CollectionStatus, string> = {
  want_to_read: "bg-yellow-100 text-yellow-800",
  reading: "bg-blue-100 text-blue-800",
  read: "bg-green-100 text-green-800",
};

export default function CollectionPage() {
  const router = useRouter();
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadCollection();
  }, []);

  async function loadCollection() {
    setLoading(true);
    try {
      const res = (await api.collection.list()) as { items: CollectionItem[]; total: number };
      setItems(res.items);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadCollection();
      return;
    }
    setLoading(true);
    try {
      const res = (await api.collection.search(searchQuery)) as {
        items: CollectionItem[];
        total: number;
      };
      setItems(res.items);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: CollectionStatus) {
    setUpdatingId(id);
    try {
      const updated = (await api.collection.update(id, { status })) as CollectionItem;
      setItems((prev) => prev.map((i) => (i._id === id ? updated : i)));
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRemove(id: string) {
    if (!confirm("Remover da coleção?")) return;
    setRemovingId(id);
    try {
      await api.collection.remove(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Minha Coleção</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Sair
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filtrar por título..."
          className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Filtrar
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={() => { setSearchQuery(""); loadCollection(); }}
            className="border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
          >
            Limpar
          </button>
        )}
      </form>

      {loading ? (
        <p className="text-gray-400 text-sm text-center mt-12">Carregando...</p>
      ) : items.length === 0 ? (
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">Sua coleção está vazia.</p>
          <a href="/" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">
            Buscar livros para adicionar
          </a>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={item._id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-start">
              {item.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-14 h-20 object-cover rounded flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-20 bg-gray-100 rounded flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-base leading-tight">{item.title}</h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_COLORS[item.status]}`}
                  >
                    {STATUS_LABELS[item.status]}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-0.5">
                  {item.authors.join(", ")}
                </p>

                {item.enriched && item.enrichedData && (
                  <p className="text-xs text-gray-400 mt-1">
                    {item.enrichedData.pageCount && `${item.enrichedData.pageCount} páginas · `}
                    {item.enrichedData.publishedDate}
                    {item.enrichedData.categories.length > 0 &&
                      ` · ${item.enrichedData.categories[0]}`}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item._id, e.target.value as CollectionStatus)}
                    disabled={updatingId === item._id}
                    className="text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  >
                    <option value="want_to_read">Quero ler</option>
                    <option value="reading">Lendo</option>
                    <option value="read">Lido</option>
                  </select>

                  <button
                    onClick={() => handleRemove(item._id)}
                    disabled={removingId === item._id}
                    className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors ml-auto"
                  >
                    {removingId === item._id ? "Removendo..." : "Remover"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
