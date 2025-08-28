"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Target } from "@/utils/types";
import DashboardHeader from "@/components/title";
import { TileLayer } from "react-leaflet";

// ✅ Carrega todo o conteúdo do mapa apenas no cliente
const MapClient = dynamic(() => import("./FitBoundsClient").then((mod) => {
 
  return function MapClient({ targets }: { targets: Target[] }) {
    return (
      <>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />
        {targets.map((target) => (
          <mod.MarkerWithPopup key={target.id} target={target} />
        ))}
        <mod.FitBoundsClient targets={targets} />
      </>
    );
  };
}), { 
  ssr: false,
  loading: () => <p>Carregando mapa...</p> 
});

// Também torne MapContainer dinâmico
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <p>Carregando mapa...</p> }
);

export default function MapaPage() {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem("userTargets");
    if (saved) setTargets(JSON.parse(saved));
    setLoading(false);
  }, []);

  if (loading) return <p className="p-6 text-center">Carregando...</p>;
  if (targets.length === 0)
    return <div className="p-6 text-gray-500">Nenhum alvo para exibir no mapa.</div>;

  return (
    <div className="h-screen w-full">
      <DashboardHeader title="Mapa de Alvos" subtitle="Marcação dos alvos" />
      <MapContainer
        center={[-14.235, -51.9253]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <MapClient targets={targets} />
      </MapContainer>
    </div>
  );
}