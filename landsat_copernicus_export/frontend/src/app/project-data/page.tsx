"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import SidebarLayout from "@/components/sidebar-layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dynamically import the Map component to prevent server-side rendering issues
const Map = dynamic(() => import("@/components/map"), {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[300px]" />,
});

const ProjectDataPage = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const projectId = localStorage.getItem("projectName") || "";
    const [constructionGoals, setConstructionGoals] = useState(localStorage.getItem("constructionGoals") || "");
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 37.7749, lng: -122.4194 }); // Default: San Francisco
    const [mapZoom, setMapZoom] = useState(10);

    // Available image options
    const imageOptions = [
        { value: "Anisha_Landsat_Image.png", label: "Image 1" },
        { value: "0891c7a9-b987-4094-95d6-6231bf0807a0_Copernicus_Image.png", label: "Image 2" },
        // Add more image options as needed
    ];

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleROISelection = async (bounds: {
        northEast: { lat: number; lng: number };
        southWest: { lat: number; lng: number };
    }) => {
        try {
            if (!projectId || !selectedImage) throw new Error("Project name or image is missing.");

            setIsProcessing(true);  // Start processing
            const response = await fetch("http://localhost:5000/api/process_roi", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    project_name: projectId,
                    image_name: selectedImage,
                    bounds: {
                        north_east: { lat: bounds.northEast.lat, lng: bounds.northEast.lng },
                        south_west: { lat: bounds.southWest.lat, lng: bounds.southWest.lng },
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong> {error}
            <Button
                onClick={() => setError(null)}
                className="ml-4"
                variant="destructive"
            >
                Clear Error
            </Button>
        </div>
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
                    <div className="relative w-full h-[400px] flex flex-col items-center bg-gray-100 rounded-lg p-4">
                        {/* Image Selector Dropdown */}
                        <Select onValueChange={setSelectedImage}>
                            <SelectTrigger className="w-[300px] mb-4">
                                <SelectValue placeholder="Select an image" />
                            </SelectTrigger>
                            <SelectContent>
                                {imageOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* Render the Map component if not loading and an image is selected */}
                        {!loading && selectedImage && (
                            <Map
                                center={mapCenter}
                                zoom={mapZoom}
                                imagePath={`/${selectedImage}`} // Assuming images are in /public
                                style={{ height: "300px", width: "100%", borderRadius: '8px' }}
                                onSelectionComplete={handleROISelection}
                                projectId={projectId}
                            />
                        )}
                        {/* Reset Image Button */}
                        <Button variant="outline" onClick={() => setSelectedImage(null)} className="mt-4">
                            Reset Image
                        </Button>

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
                    <Input
                        value={constructionGoals}
                        onChange={(e) => setConstructionGoals(e.target.value)}
                        className="min-h-[200px] bg-gray-100 p-3 rounded-md"
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
            </div>
        </div>
    </SidebarLayout>
);
};

export default ProjectDataPage;