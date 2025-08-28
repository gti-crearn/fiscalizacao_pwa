// components/FitBoundsClient.tsx
"use client";
import { Marker, Popup, useMap } from "react-leaflet";
import { Target } from "@/utils/types";
import L from "leaflet";
import { useEffect } from "react";

// Corrige ícones default (só no cliente)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/icons/marker-icon-2x.png",
    iconUrl: "/icons/marker-icon.png",
    shadowUrl: "/icons/marker-shadow.png",
});

const createCustomIcon = (color: "green" | "yellow" | "gray" | "red") =>
    new L.Icon({
        iconUrl: `/${color}.png`,
        shadowUrl: "/icons/marker-shadow.png",
        // iconSize: [25, 41],
        iconAnchor: [12, 41],
    });

export function FitBoundsClient({ targets }: { targets: Target[] }) {
    const map = useMap();

    // Atualiza o mapa quando os targets mudarem
    useEffect(() => {
        if (targets.length === 0) return;
        const bounds: [number, number][] = [];
        targets.forEach((t) => {
            const lat = parseFloat(t.latitude);
            const lng = parseFloat(t.longitude);
            if (!isNaN(lat) && !isNaN(lng)) bounds.push([lat, lng]);
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

export function MarkerWithPopup({ target }: { target: Target }) {
    const { latitude, longitude, empresa, numeroArt, enderecoObra, telefoneProprietario } = target;
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) return null;

    const customIcon = createCustomIcon(
        ["CONCLUÍDA"].includes(target.status.trim().toUpperCase())
            ? "green"
            : ["EM ANDAMENTO", "EM ATENDIMENTO"].includes(target.status.trim().toUpperCase())
                ? "yellow"
                : "gray"
    );

    // Cria o link do Google Maps
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

    return (
        <Marker position={[lat, lng]} icon={customIcon}>
            <Popup>
                <div className="text-sm">
                    <h3 className="font-semibold">{empresa}</h3>
                    <p><strong>ART:</strong> {numeroArt}</p>
                    <p><strong>Endereço:</strong> {enderecoObra}</p>
                    <p><strong>Telefone:</strong> {telefoneProprietario}</p>

                    {/* Link para abrir no Google Maps */}
                    <p className="mt-2">
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-xs"
                        >
                            🌍 Ver no Google Maps
                        </a>
                    </p>
                </div>
            </Popup>
        </Marker>
    );
}