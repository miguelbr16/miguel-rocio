"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Destination } from "@/data/destinations";
import { PIN_COLORS, STATUS_LABELS } from "@/data/destinations";
import Link from "next/link";

const pinIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

interface DestinationsMapProps {
  destinations: Destination[];
}

export function DestinationsMap({ destinations }: DestinationsMapProps) {
  return (
    <MapContainer
      center={[30, 10]}
      zoom={2}
      minZoom={1}
      maxZoom={6}
      className="h-[280px] w-full z-0"
      scrollWheelZoom={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      {destinations.map((d) => (
        <Marker
          key={d.name}
          position={[d.lat, d.lng]}
          icon={pinIcon(PIN_COLORS[d.status])}
        >
          <Popup>
            <div className="text-sm">
              <strong>
                {d.flag} {d.name}
              </strong>
              <div className="text-xs text-gray-500">{STATUS_LABELS[d.status]}</div>
              {d.label ? <div className="text-xs">{d.label}</div> : null}
              {d.url ? (
                <Link href={d.url} className="mt-1 block text-xs text-rose-600">
                  Ver la web →
                </Link>
              ) : null}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
