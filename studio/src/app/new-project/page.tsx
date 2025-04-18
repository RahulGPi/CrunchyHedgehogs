"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coordinates } from "@/services/satellite-imagery";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Map } from "@/components/map"; // Import the global Map component

export default function NewProjectPage() {
  const [projectName, setProjectName] = useState("");
  const [locationCoordinates, setLocationCoordinates] = useState<Coordinates | null>(null);

  const router = useRouter();

  const handleLocationSelect = (coordinates: Coordinates) => {
    setLocationCoordinates(coordinates);
  };

  const handleFindLocation = () => {
    if (locationCoordinates) {
      router.push(
        `/satellite-image?latitude=${locationCoordinates.latitude}&longitude=${locationCoordinates.longitude}`
      );
    } else {
      alert("Please select a location on the map.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-4">New Project</h1>
      <div className="flex flex-col space-y-4 w-full max-w-md">
        <Input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="mb-4"
        />

        <Map onLocationSelect={handleLocationSelect} />

        {locationCoordinates && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Location</CardTitle>
              <CardDescription>
                Latitude: {locationCoordinates.latitude}, Longitude: {locationCoordinates.longitude}
              </CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        )}

        <Button onClick={handleFindLocation} variant="primary" disabled={!locationCoordinates}>
          Find Satellite Image
        </Button>
      </div>
    </div>
  );
}
