"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { AuthResponse } from "@/lib/types";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fn = mode === "login" ? api.auth.login : api.auth.register;
      const res = (await fn(email, password)) as AuthResponse;
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.userId);
      router.push("/collection");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {mode === "login" ? "Entrar" : "Criar conta"}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded p-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white rounded-lg py-2 font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-600">
        {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
        <button
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
          className="text-indigo-600 font-medium hover:underline"
        >
          {mode === "login" ? "Criar conta" : "Entrar"}
        </button>
      </p>
    </div>
  );
}
