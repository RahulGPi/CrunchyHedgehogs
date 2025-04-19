"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import SidebarLayout from "@/components/sidebar-layout";

// Dynamically import the Map component to prevent server-side rendering issues
const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[300px]" />,
});

const ProjectDataPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const projectId = localStorage.getItem("projectName") || "";
  const constructionGoals = localStorage.getItem("constructionGoals") || "";
  const [isProcessing, setIsProcessing] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    // Load map view from local storage if available
    const storedView = localStorage.getItem(`mapView_${projectId}`);
    if (storedView) {
      const { center, zoom } = JSON.parse(storedView);
      setMapCenter(center);
      setMapZoom(zoom);
    }
    setLoading(false);
  }, [projectId]); // Only re-run on projectId change

  const handleROISelection = async (bounds: {
    _northEast: { lat: number; lng: number };
    _southWest: { lat: number; lng: number };
  }) => {
    try {
      if (!projectId) throw new Error("Project name is missing.");

      setIsProcessing(true);  // Start processing
      const response = await fetch("http://localhost:5000/api/process_roi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: projectId,  // Ensure this matches your backend's expectation
          bounds: {
            north_east: { lat: bounds._northEast.lat, lng: bounds._northEast.lng },
            south_west: { lat: bounds._southWest.lat, lng: bounds._southWest.lng },
          },
          construction_goals: constructionGoals,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process ROI.");
      }

      const data = await response.json();
      console.log("Processed image:", data.image_path);

      setProcessedImage(data.image_path);
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred during ROI processing.");
    } finally {
      setIsProcessing(false);  // End processing regardless of success or failure
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-screen">
          <Skeleton className="w-[300px] h-[300px]" />
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
        <SidebarLayout>
          <div className="flex items-center justify-center h-screen">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error:</strong> {error}
              <Button
                  onClick={() => setError(null)}
                  className="ml-4"
                  variant="destructive"
              >
                Clear Error
              </Button>
            </Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Satellite Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[300px] flex justify-center items-center bg-gray-100 rounded-lg">
              {/* Render the Map component if not loading */}
              {!loading && (
                  <Map
                      center={mapCenter}
                      zoom={mapZoom}
                      style={{ height: "300px", width: "100%", borderRadius: '8px' }}
                      onSelectionComplete={handleROISelection}
                      projectId={projectId}
                  />
              )}

              {/* Overlay to indicate processing */}
              {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                      <div className="text-white">Processing ROI...</div>
                    </div>
                  </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Construction Goals Card */}
        <Card>
          <CardHeader>
            <CardTitle>Construction Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[200px] bg-gray-100 p-3 rounded-md">
              {constructionGoals || "No construction goals set."}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="md:col-span-2 flex justify-end">
          <Button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isProcessing || loading}  // Disable during processing or loading
          >
            {isProcessing ? "Processing..." : "Save Project"}
          </Button>

          {/* You might not need a separate "Clear ROI" button with the new map component */}
          <Button 
            onClick={() => router.push("/dashboard")}
            className="bg-blue-500 text-white px-8 py-4 rounded-md hover:bg-blue-600"
          >
            Save Project
          </Button>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ProjectDataPage;