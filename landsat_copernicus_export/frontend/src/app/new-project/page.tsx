"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getGeoLocationInfo } from "@/services/geo-location";
import { useToast } from "@/hooks/use-toast";

export default function NewProjectPage() {
  const [projectName, setProjectName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedProjectName = projectName.trim();
    const trimmedLatitude = latitude.trim();
    const trimmedLongitude = longitude.trim();

    if (
      isNaN(Number(trimmedLatitude)) ||
      isNaN(Number(trimmedLongitude))
    ) {
      const errorMessage = "Invalid latitude or longitude values.";
      setError(errorMessage);
      toast({
        title: "Error",
        variant: "destructive",
        description: errorMessage,
      });
      setLoading(false);
      return;
    }

    try {
      const locationInfo = await getGeoLocationInfo(
        Number(trimmedLatitude),
        Number(trimmedLongitude)
      );
      const response = await fetch("/api/save-project", {
        method: "POST",
        body: JSON.stringify({
          projectName,
          latitude,
          longitude,
          locationName: locationInfo.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save project");
      }

      router.push("/dashboard");
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred while saving the project.";
      setError(errorMessage);
      toast({
        title: "Error",
        variant: "destructive",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            required
          />

          {/* Latitude Input */}

          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              type="number"
              id="latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Enter latitude"
              required
            />

            {/* Longitude Input */}
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              type="number"
              id="longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Enter longitude"
              required
            />

            {/* Create Project Button */}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </div>
    </div>
  );
}