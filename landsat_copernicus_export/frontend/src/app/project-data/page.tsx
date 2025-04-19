"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SidebarLayout from "@/components/sidebar-layout";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import Image from "next/image";
import ImageSelector from "@/components/ImageSelector";

const ProjectDataPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const constructionGoals = searchParams.get('constructionGoals');
  const [projectName, setProjectName] = useState("");
  const [satelliteImage, setSatelliteImage] = useState("/Anisha_Landsat_Image.png");
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisPoint, setAnalysisPoint] = useState<[number, number] | null>(null);

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const projects = JSON.parse(storedProjects);
      const project = projects.find((p: { id: string | null }) => p.id === projectId);
      if (project) {
        setProjectName(project.name);
        // Load the actual image path from project data if available
        if (project.satelliteImageUrl) {
          setSatelliteImage(project.satelliteImageUrl);
        }
      }
    }
  }, [projectId]);

  const handleROISelection = async (points: {x: number, y: number}[]) => {
    try {
      setIsProcessing(true);
      
      // First run the analysis to get the recommended point
      const analysisRes = await fetch('http://localhost:5000/api/analyze_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_name: projectId
        })
      });

      if (!analysisRes.ok) throw new Error('Analysis failed');
      
      const analysisData = await analysisRes.json();
      setAnalysisPoint(analysisData.coordinates);

      // Then process the ROI with the selected points
      const roiRes = await fetch('http://localhost:5000/api/process_roi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_name: projectId,
          points: points.map(p => [p.x, p.y]),
          analysis_point: analysisData.coordinates
        })
      });

      if (!roiRes.ok) throw new Error('ROI processing failed');
      
      const roiData = await roiRes.json();
      setProcessedImage(roiData.image_path);
      
    } catch (error) {
      console.error('Error processing ROI:', error);
      alert('Failed to process ROI. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    router.push("/dashboard");
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Satellite Map with ROI Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Satellite Map</CardTitle>
          </CardHeader>
          <CardContent>
            {processedImage ? (
              <div className="relative w-full h-[300px]">
                <Image
                  src={processedImage}
                  alt="Processed Satellite Map"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <ImageSelector 
                imageUrl={satelliteImage}
                onSelectionComplete={handleROISelection}
              />
            )}
            {isProcessing && (
              <div className="mt-4 text-center text-muted-foreground">
                Processing ROI and analysis...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Construction Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Construction Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={constructionGoals || ""}
              readOnly
              className="min-h-[200px] bg-muted"
            />
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisPoint && (
          <Card>
            <CardHeader>
              <CardTitle>Recommended Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>AI Recommended Coordinates:</p>
                <p className="font-mono bg-muted p-2 rounded">
                  ({analysisPoint[0]}, {analysisPoint[1]})
                </p>
                <p className="text-sm text-muted-foreground">
                  This location was selected based on optimal conditions for your project.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rest of your existing cards... */}

        {/* Save Button */}
        <div className="md:col-span-2 flex justify-end">
          <Button 
            onClick={handleSave} 
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