"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Image from "next/image";
import ImageSelector from "@/components/ImageSelector";
import { Skeleton } from "@/components/ui/skeleton";
import SidebarLayout from '@/components/sidebar-layout';

const ProjectDataPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const projectId = searchParams.get('projectId') || '';
  const constructionGoals = searchParams.get('constructionGoals') || '';
  
  const [satelliteImage, setSatelliteImage] = useState("");
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        console.log(`Fetching image for project: ${projectId}`);
        
        const response = await fetch(`http://localhost:5000/api/get_latest_image/${projectId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        
        const data = await response.json();
        const imagePath = `/${projectId}_Landsat_Image.png`;
        console.log(`Setting image path to: ${imagePath}`);
        setSatelliteImage(imagePath);
        
      } catch (err) {
        console.error("Error fetching image:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        // Fallback to default image
        setSatelliteImage("/Anisha_Landsat_Image.png");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchImage();
    } else {
      setError("Project ID not found.");
      setLoading(false);
    }
  }, [projectId]);

  const hasImage = satelliteImage !== "";

  const handleROISelection = async (points: { x: number; y: number }[]) => {
    try {
      if (points.length < 3) {
        throw new Error("Please select at least 3 points to define an ROI");
      }

      setIsProcessing(true);
      
      // Get canvas dimensions for coordinate normalization
      const canvas = document.querySelector('canvas');
      if (!canvas) throw new Error("Canvas element not found");
      
      // Normalize coordinates to 0-1 range
      const normalizedPoints = points.map(p => ({
        x: p.x / canvas.width,
        y: p.y / canvas.height
      }));

      const response = await fetch("http://localhost:5000/api/process_roi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: projectId,
          points: normalizedPoints,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "ROI processing failed");
      }
      
      const data = await response.json();
      console.log("Processed image:", data.image_path);
      
      // Update state with the processed image path
      setProcessedImage(data.image_path);
      
    } catch (error) {
      console.error("ROI processing error:", error);
      setError(error instanceof Error ? error.message : "Failed to process ROI");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetSelection = () => {
    setProcessedImage(null);
    setError(null);
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
          <div className="text-red-500 p-4 border rounded-lg bg-background">
            Error: {error}
            <Button 
              onClick={() => setError(null)} 
              className="mt-2"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Satellite Map Card */}
        <Card>
          <CardHeader>
            <CardTitle>Satellite Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-[300px] flex justify-center items-center bg-gray-100 rounded-lg">
              {hasImage ? (
                <>
                  {processedImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={processedImage}
                        alt="Processed ROI"
                        fill
                        className="object-contain"
                        priority
                        onError={() => setError("Failed to load processed image")}
                      />
                      <Button 
                        onClick={handleResetSelection}
                        className="absolute top-2 right-2 z-10"
                        variant="outline"
                        size="sm"
                      >
                        Reset Selection
                      </Button>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={satelliteImage}
                        alt="Satellite Image"
                        fill
                        className="object-contain"
                        priority
                        onError={() => setError("Failed to load satellite image")}
                      />
                      <ImageSelector
                        imageUrl={satelliteImage}
                        onSelectionComplete={handleROISelection}
                        projectId={projectId}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground">
                  No image available
                </div>
              )}
              
              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
              readOnly
              className="min-h-[200px] bg-muted"
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="md:col-span-2 flex justify-end gap-4">
          {processedImage && (
            <Button 
              onClick={handleResetSelection}
              variant="outline"
              className="px-8 py-4"
            >
              Clear ROI
            </Button>
          )}
          <Button 
            onClick={() => router.push("/dashboard")}
            className="bg-primary text-primary-foreground hover:bg-primary/80 px-8 py-4"
          >
            Save Project
          </Button>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ProjectDataPage;