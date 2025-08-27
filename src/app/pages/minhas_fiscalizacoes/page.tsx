"use client";
import { DataContext } from "@/context/AuthData";
import { useContext } from "react";


export default function DashboardPage() {
  const { userData, isOffline } = useContext(DataContext);
  console.log(userData)

  // defensivo: garante array na renderização
  const list = Array.isArray(userData) ? userData : [];

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-bold">Minhas Fiscalizações</h1>
        {isOffline && (
          <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
            Modo offline
          </span>
        )}
      </div>

      {list.length === 0 ? (
        <p>Nenhum dado encontrado.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((user) => (
            <li key={user.id} className="p-3 bg-gray-100 rounded shadow-sm">
              <p><strong>Nome:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              {/* coloque seus campos de fiscalização aqui */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
