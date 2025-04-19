"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
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

  useEffect(() => {}, [pathname, satelliteImage])

    const handleROISelection = async (points: { x: number; y: number }[]) => {
    try {
      setIsProcessing(true);
      console.log("Processing ROI with points:", points);
      
      const response = await fetch("http://localhost:5000/api/process_roi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: projectId,
          points: points.map((p) => [p.x, p.y]),
        }
        ),
      });

      if (!response.ok) throw new Error("ROI processing failed");
      
      const data = await response.json();
      console.log("Processed image path:", data.image_path);
      setProcessedImage(data.image_path);
      
    } catch (error) {
      console.error("ROI processing error:", error);
      setError("Failed to process ROI. Please try again.");
    } finally {
      setIsProcessing(false);
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
          <div className="text-red-500 p-4 border rounded-lg bg-background">
            Error: {error}
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
              {hasImage && (
                  processedImage ? (
                    <Image
                      src={processedImage}
                      alt="Processed Satellite Map"
                      fill
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <>
                  <Image
                    src={satelliteImage}
                    alt="Satellite Image"
                    fill
                    className="object-contain"
                    priority
                 
                  />
                 
                 
                  
                  
                  <ImageSelector
                    imageUrl={satelliteImage}
                    onSelectionComplete={handleROISelection}
                    projectId={projectId}
                  />
                </>
              ) : (
                <div className="text-muted-foreground">
                  No image available
                </div>
              )}
              
              {isProcessing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white">Processing ROI...</div>
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
        <div className="md:col-span-2 flex justify-end">
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