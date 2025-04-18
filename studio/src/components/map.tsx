"use client";

import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Coordinates } from '@/services/satellite-imagery';

interface MapProps {
    onLocationSelect: (coordinates: Coordinates) => void;
}

export function Map({ onLocationSelect }: MapProps) {
    const [position, setPosition] = useState<L.LatLngExpression>([51.505, -0.09]);

    function MapEvents() {
        useMapEvents({
            click: (e) => {
                setPosition(e.latlng);
                onLocationSelect({ latitude: e.latlng.lat, longitude: e.latlng.lng });
            },
        });
        return null;
    }

    return (
        <MapContainer center={position} zoom={13} style={{ height: '300px', width: '100%', borderRadius: '8px', border: '1px solid #ccc' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapEvents />
            {position && (
                <Marker
                    position={position}
                    icon={L.icon({
                        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                    })}
                />
            )}
        </MapContainer>
    );
}
