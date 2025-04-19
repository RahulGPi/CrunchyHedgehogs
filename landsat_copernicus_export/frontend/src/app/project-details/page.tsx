"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Image from "next/image";

// Define a type for the props
interface ProjectDetailsProps {
}

export default function ProjectDetails({}: ProjectDetailsProps) {
  const searchParams = useSearchParams();
  const projectName = searchParams.get("projectName");
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");

  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter([Number(latitude), Number(longitude)]);
      setIsMapReady(true);
    }
  }, [latitude, longitude]);
    useEffect(() => {
        if (projectName) {
            setImagePath(`/downloaded_images/landsat_images/${projectName}_Landsat_Image.png`);
        }
    }, [projectName]);


  const customIcon = L.icon({
    iconUrl: "/marker-icon.png",
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: "/marker-shadow.png",
    shadowSize: [68, 95],
    shadowAnchor: [22, 94],
  });
  if (!projectName || !latitude || !longitude) {
    return <div>Project details are missing.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Project Details</h1>
      <div className="mb-4">
        <p>
          <span className="font-semibold">Project Name:</span> {projectName}
        </p>
        <p>
          <span className="font-semibold">Latitude:</span> {latitude}
        </p>
        <p>
          <span className="font-semibold">Longitude:</span> {longitude}
        </p>
      </div>
      <div className="h-[400px] mb-4">
        {isMapReady && (
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={mapCenter} icon={customIcon}>
              <Popup>
                Latitude: {latitude}, Longitude: {longitude}
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
        {imagePath && (
            <div className="relative w-full h-[500px]">
            <Image
                src={imagePath}
                alt="Landsat Image"
                fill
                style={{objectFit:"contain"}}
                
            />
            </div>
        )}

    </div>
  );
}