"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leaflet's default marker icon path fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  center: { lat: number; lng: number };
  zoom: number;
  style: React.CSSProperties;
  onSelectionComplete: (bounds: {
    _northEast: { lat: number; lng: number };
    _southWest: { lat: number; lng: number };
  }) => void;
  projectId: string;
}

const Map: React.FC<MapProps> = ({ center, zoom, style, onSelectionComplete, projectId }) => {
  const [startLatLng, setStartLatLng] = useState<L.LatLng | null>(null);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const handleMouseDown = (e: L.LeafletMouseEvent) => {
    setStartLatLng(e.latlng);
  };

  const handleMouseMove = (e: L.LeafletMouseEvent) => {
    if (startLatLng) {
      const newBounds = L.latLngBounds(startLatLng, e.latlng);
      setBounds(newBounds);
    }
  };

  const handleMouseUp = () => {
    if (bounds) {
      onSelectionComplete({
        _northEast: bounds.getNorthEast(),
        _southWest: bounds.getSouthWest(),
      });
      setStartLatLng(null);
      setBounds(null);
    }
  };

  const MapEvents = () => {
    const map = useMapEvents({
      mousedown: handleMouseDown,
      mousemove: handleMouseMove,
      mouseup: handleMouseUp,
      zoomend: () => {
        // Update bounds when zooming to keep selection visible
        if (startLatLng) {
          const currentCenter = map.getCenter();
          const newBounds = L.latLngBounds(startLatLng, currentCenter);
          setBounds(newBounds);
        }
      },
    });

    useEffect(() => {
      mapRef.current = map;
    }, [map]);

    return null;
  };

  useEffect(() => {
    // Load initial view from local storage if available
    const storedView = localStorage.getItem(`mapView_${projectId}`);
    if (storedView) {
      const { center: storedCenter, zoom: storedZoom } = JSON.parse(storedView);
      if (mapRef.current) {
        mapRef.current.setView(storedCenter, storedZoom);
      }
    }
  }, [projectId]);

  const handleMoveEnd = () => {
    // Store current view in local storage
    if (mapRef.current) {
      const currentCenter = mapRef.current.getCenter();
      const currentZoom = mapRef.current.getZoom();
      localStorage.setItem(`mapView_${projectId}`, JSON.stringify({ center: currentCenter, zoom: currentZoom }));
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ ...style, cursor: 'crosshair' }}
      ref={mapRef}
      onMoveend={handleMoveEnd}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents />
      {bounds && <Rectangle bounds={bounds} pathOptions={{ color: 'blue', fillOpacity: 0.2 }} />}
    </MapContainer>
  );
};
export default Map;


