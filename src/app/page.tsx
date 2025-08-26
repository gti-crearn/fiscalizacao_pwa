// src/components/Login.tsx
"use client";
import React, { useState, FormEvent } from "react";
import { LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";


export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login, error, loading } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(username, password);     
    } catch (err) {
      console.error("Falha no login:", err);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 font-sans">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md text-center">
        <h2 className="mb-6 text-gray-800 text-2xl font-semibold">Entrar</h2>

        {/* Exibe erro se houver */}
        {error && (
          <div className="bg-red-100 border border-red-300 p-2 rounded mb-4 text-red-500 text-sm font-medium">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Usuário */}
          <div className="flex flex-col items-start">
            <label
              htmlFor="username"
              className="text-sm text-gray-600 mb-2 font-medium"
            >
              Nome de usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              disabled={loading}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition"
            />
          </div>

          {/* Senha */}
          <div className="flex flex-col items-start">
            <label
              htmlFor="password"
              className="text-sm text-gray-600 mb-2 font-medium"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              disabled={loading}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition"
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-4 py-3 bg-indigo-500 text-white rounded-md text-base font-semibold flex items-center justify-center gap-3 hover:bg-indigo-600 active:scale-95 transition disabled:opacity-60"
          >
            {loading ? "Carregando..." : <><LogIn size={20} /> Entrar</>}
          </button>
        </form>
      </div>
    </div>
  );
};
