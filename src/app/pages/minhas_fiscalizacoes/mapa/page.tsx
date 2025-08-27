// src/app/mapa/page.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Target } from "@/utils/types";
import DashboardHeader from "@/components/title";

// ❌ Remove isso (evita conflito com ícones personalizados)
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Função para criar ícone com base no status
const createCustomIcon = (color: 'green' | 'yellow' | 'gray' | 'red') => {
  return new L.Icon({
    iconUrl: `/${color}.png`, // ✅ Lê de /public
    shadowUrl: '/icons/marker-shadow.png', // Recomendado: salve o shadow também
    // iconSize: [50, 50],
    // // iconAnchor: [12, 41],
    // popupAnchor: [1, -34],
    // // shadowSize: [41, 41],
  });
};

// Mapeia status para o nome do arquivo
const getStatusColor = (status: string): 'green' | 'yellow' | 'gray' | 'red' => {
  const normalized = status.trim().toUpperCase();

  if (normalized === "CONCLUÍDA") return "green";
  if (["EM ANDAMENTO", "EM ATENDIMENTO"].includes(normalized)) return "yellow";
  if (normalized === "NÃO INICIADA") return "gray";

  return "red"; // padrão
};

// Hook para ajustar o zoom nos marcadores
function FitBounds({ targets }: { targets: Target[] }) {
  const map = useMap();
  useEffect(() => {
    if (targets.length === 0) return;

    const bounds: [number, number][] = [];

    targets.forEach((t) => {
      const lat = parseFloat(t.latitude);
      const lng = parseFloat(t.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        bounds.push([lat, lng]);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds as L.LatLngBoundsLiteral, {
        padding: [50, 50],
        maxZoom: 15,
        animate: true,
      });
    }
  }, [targets, map]);

  return null;
}

export default function MapaPage() {
  const [targets, setTargets] = useState<Target[]>([]);
  console.log(targets)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem("userTargets");
    if (saved) {
      setTargets(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <p className="p-6 text-center">Carregando mapa...</p>;
  }

  if (targets.length === 0) {
    return <div className="p-6 text-gray-500">Nenhum alvo para exibir no mapa.</div>;
  }

  return (
    <div className="h-screen w-full" style={{ height: "100vh" }}>
        <DashboardHeader title="Mapa de Alvos" subtitle="Marcação dos alvos"/>
      <MapContainer
        center={[-14.235, -51.9253]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marcadores com ícones personalizados */}
        {targets.map((t) => {
          const lat = parseFloat(t.latitude);
          const lng = parseFloat(t.longitude);
          const isValid = !isNaN(lat) && !isNaN(lng);

          if (!isValid) return null;

          const color = getStatusColor(t.status);
          const customIcon = createCustomIcon(color);

          return (
            <Marker key={t.id} position={[lat, lng]} icon={customIcon}>
              <Popup>
                <div className="text-sm">
                  <h3 className="font-semibold">{t.empresa}</h3>
                  <p><strong>ART:</strong> {t.numeroArt}</p>
                  <p><strong>Endereço:</strong> {t.enderecoObra}</p>
                  <p><strong>Telefone propietario</strong> {t.telefoneProprietario} </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-1 py-0.5 rounded text-xs ${
                        t.status === "CONCLUÍDA"
                          ? "bg-green-100 text-green-800"
                          : t.status === "EM ANDAMENTO"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {t.status}
                    </span>
                  </p>
                  <div className="mt-2">
                    <a
                      href={`https://www.google.com/maps?q=${lat},${lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-xs underline hover:text-blue-800 font-medium"
                    >
                      🔗 Ver no Google Maps
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Ajusta o zoom para mostrar todos os pontos */}
        <FitBounds targets={targets} />
      </MapContainer>
    </div>
  );
}