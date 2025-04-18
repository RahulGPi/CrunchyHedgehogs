"use client";

import { SatelliteImage, getSatelliteImage } from "@/services/satellite-imagery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SatelliteImagePageProps {
  searchParams: {
    latitude: string;
    longitude: string;
  };
}

export default async function SatelliteImagePage({ searchParams }: SatelliteImagePageProps) {
  const { latitude, longitude } = searchParams;

  // Basic validation
  if (!latitude || !longitude) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-semibold mb-4">Error</h1>
        <p className="text-lg">
          Latitude and longitude are required parameters.
        </p>
      </div>
    );
  }

  const latitudeNumber = parseFloat(latitude);
  const longitudeNumber = parseFloat(longitude);

  if (isNaN(latitudeNumber) || isNaN(longitudeNumber)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-semibold mb-4">Error</h1>
        <p className="text-lg">
          Invalid latitude or longitude values.
        </p>
      </div>
    );
  }

  const satelliteImage: SatelliteImage = await getSatelliteImage({
    latitude: latitudeNumber,
    longitude: longitudeNumber,
  });

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-4">Satellite Image</h1>
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>
            Latitude: {latitudeNumber}, Longitude: {longitudeNumber}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={satelliteImage.imageUrl}
            alt="Satellite Image"
            className="rounded-md shadow-md"
          />
        </CardContent>
      </Card>
    </div>
  );
}
