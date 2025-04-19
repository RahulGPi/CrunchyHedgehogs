"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Make sure this is correctly imported
import L, { LatLngBounds } from 'leaflet';

interface MapProps {
  center: { lat: number; lng: number };
  style: React.CSSProperties;
  onSelectionComplete: (bounds: { northEast: { x: number; y: number }; southWest: { x: number; y: number } }) => void;
  projectId: string;
  imagePath: string; // Add imagePath prop
}

const Map: React.FC<MapProps> = ({ center, zoom, style, onSelectionComplete, projectId }) => {
  const [startLatLng, setStartLatLng] = useState<L.LatLng | null>(null);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null); // Ref for the image element

  const [currentBounds, setCurrentBounds] = useState<LatLngBounds | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false); // State to track image loading
  const handleImageLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
  }, []);

  const handleMouseDown = (e: L.LeafletMouseEvent) => {
    if (mapInitialized && imageSize) {
      setStartLatLng(e.latlng); // Store LatLng for bounds calculation
    }
  };

  const handleMouseMove = (e: L.LeafletMouseEvent) => {
    if (mapInitialized && imageSize && startLatLng) {
      setBounds(L.latLngBounds(startLatLng, e.latlng)); // Update bounds as mouse moves
    }
  };

  const handleMouseUp = () => {
    if (mapInitialized && imageSize && bounds) {
      const containerTopLeft = mapRef.current!.latLngToContainerPoint(bounds.getNorthWest());
      const containerBottomRight = mapRef.current!.latLngToContainerPoint(bounds.getSouthEast());

      const northEast = { x: containerTopLeft.x, y: containerTopLeft.y }; // Top-left
      const southWest = { x: containerBottomRight.x, y: containerBottomRight.y }; // Bottom-right

      onSelectionComplete({ northEast, southWest });
      setStartLatLng(null);
      setBounds(null);
    }
  };
  const MapEvents = () => {
    const map = useMapEvents({
      load: () => {// Use the same zoom level as before
        setMapInitialized(true);
      },
      mousedown: handleMouseDown,
      mousemove: handleMouseMove,
      mouseup: handleMouseUp,
    });

    useEffect(() => {
      mapRef.current = map;
    }, [map]);
    return null;
  };

  useEffect(() => {
    if (mapRef.current && bounds) {
      const northWest = mapRef.current.containerPointToLatLng({ x: bounds.getNorthWest().lng, y: bounds.getNorthWest().lat });
      const southEast = mapRef.current.containerPointToLatLng({ x: bounds.getSouthEast().lng, y: bounds.getSouthEast().lat });
  
      setCurrentBounds(L.latLngBounds(southEast, northWest));
    } else {
      setCurrentBounds(null);
    }
  }, [bounds]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ ...style, cursor: 'crosshair' }}
      ref={mapRef}
      crs={L.CRS.Simple} // Use a simple coordinate system
    >
      <TileLayer
        url={imagePath}
        attribution=""
        tileSize={256}
        noWrap={true}
        bounds={[[center.lat - 0.5, center.lng - 0.5], [center.lat + 0.5, center.lng + 0.5]]}
        eventHandlers={{
          load: handleImageLoad,
        }}
      />
      <MapEvents />
      {currentBounds && (
        <L.Rectangle
          bounds={currentBounds}
          pathOptions={{ color: 'blue', fillOpacity: 0.2 }} />
      )}
    </MapContainer>
  );
};

export default Map;
