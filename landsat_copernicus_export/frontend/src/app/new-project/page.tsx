"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SidebarLayout from "@/components/sidebar-layout";

const NewProjectForm = () => {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [location, setLocation] = useState({
    displayName: "",
    coordinates: { lat: 0, lng: 0 },
  });

  const handleLocationSelect = (/* event from map component */) => {
    // Placeholder: Replace with actual map selection logic
    const selectedLocation = {
      displayName: "Selected Location",
      coordinates: { lat: 34.0522, lng: -118.2437 }, // Example coordinates
    };
    setLocation(selectedLocation);
  };

  const handleSubmit = () => {
    // Navigate to satellite image screen
    router.push("/satellite-image");
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-semibold mb-4">Create New Project</h1>
        <div className="flex flex-col space-y-4">
          <Input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          {/* Placeholder for Map Component */}
          <div className="border rounded-md p-4">
            <p>Map Location Selector (Implement Map Component Here)</p>
            <Button onClick={handleLocationSelect} className="mt-2 bg-accent text-accent-foreground hover:bg-accent/80">
              Select Location
            </Button>
          </div>

          {location.displayName && (
            <div className="mt-2">
              <p>
                Location: {location.displayName} (Lat: {location.coordinates.lat}, Lng:{" "}
                {location.coordinates.lng})
              </p>
            </div>
          )}

          <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/80">
            Create Project
          </Button>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default NewProjectForm;

