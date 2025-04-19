"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Make sure this is correctly imported
import L, { LatLngBounds } from 'leaflet';

interface MapProps {
  center: { lat: number; lng: number };
  style: React.CSSProperties;
  onSelectionComplete: (bounds: { northEast: { x: number, y: number }, southWest: { x: number, y: number } }) => void;
  projectId: string;
  imagePath: string; // Add imagePath prop
}

const Map: React.FC<MapProps> = ({ center, zoom, style, onSelectionComplete, projectId }) => {
  const [startLatLng, setStartLatLng] = useState<L.LatLng | null>(null);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number, height: number } | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Update the type of 'bounds' to LatLngBounds | null
  const [currentBounds, setCurrentBounds] = useState<LatLngBounds | null>(null);

  const handleImageLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
  }, []);

  const handleMouseDown = (e: L.LeafletMouseEvent) => {
    if (mapInitialized && imageSize) {
      const { x, y } = mapRef.current!.containerPointToLatLng(e.containerPoint);
      setStartLatLng(e.latlng);
    }
  };

  const handleMouseMove = (e: L.LeafletMouseEvent) => {
    if (mapInitialized && imageSize && startLatLng) {
      setBounds(L.latLngBounds(startLatLng, e.latlng));
    }
  };

  const handleMouseUp = () => {
    if (mapInitialized && imageSize && bounds) {
      const { _northEast, _southWest } = bounds;
      const { x: neX, y: neY } = mapRef.current!.latLngToContainerPoint(_northEast);
      const { x: swX, y: swY } = mapRef.current!.latLngToContainerPoint(_southWest);

      // Adjust calculation to be relative to the image dimensions
      const northEast = { x: neX, y: neY };
      const southWest = { x: swX, y: swY };

      onSelectionComplete({ northEast, southWest });
      setStartLatLng(null);
      setBounds(null);
    }
  };

  const MapEvents = () => {
    const map = useMapEvents({
      load: () => {
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
      setCurrentBounds(bounds);
    } else {
      setCurrentBounds(null);
    }
  }, [bounds]);

  return (
    <MapContainer
      center={center}
      zoom={13} // Adjust zoom level as needed
      style={{ ...style, cursor: 'crosshair' }}
      ref={mapRef}
      crs={L.CRS.Simple} // Use a simple coordinate system
    >
      {imageSize && (
        <TileLayer
          url={""} // Empty URL for the TileLayer
          attribution=""
          bounds={[[0, 0], [imageSize.height, imageSize.width]]}
          noWrap={true}
          minZoom={mapRef.current?.getMinZoom() || -10}
          maxZoom={mapRef.current?.getMaxZoom() || 10}
          tileSize={L.point(imageSize.width, imageSize.height)}
          className="leaflet-tile-loaded"
        />
      )}

      <MapEvents />
      {currentBounds && <L.Rectangle bounds={currentBounds} pathOptions={{ color: 'blue', fillOpacity: 0.2 }} />}
    </MapContainer>
  );
};

export default Map;
