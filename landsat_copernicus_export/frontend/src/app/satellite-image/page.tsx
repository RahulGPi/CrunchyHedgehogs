"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SidebarLayout from "@/components/sidebar-layout";
import Image from "next/image"; 

interface SatelliteImagePageProps {
  searchParams: {};
}
const SatelliteImagePage: React.FC<SatelliteImagePageProps> = () => {
  const router = useRouter();
  const projectId = searchParams.projectId;
  const [constructionGoals, setConstructionGoals] = useState("");
  const [projectName, setProjectName] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve project details from local storage
  }, []);

  const handleGo = () => {
    // Save project details to local storage
    localStorage.setItem("projectName", projectId);
    localStorage.setItem("imageName", `${projectId}_Landsat_Image.png`);
    localStorage.setItem("constructionGoals", constructionGoals);

    // Redirect to the project data page
    router.push(`/project-data?projectId=${projectId}`);
  };
  
  return (
    <SidebarLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-semibold mb-6">Project Satellite Image</h1>
        {projectName && imageName ? (
          <div className="flex flex-row items-start space-x-6">
            {/* Image container - left side */}
            <div className="rounded-md shadow-md w-[500px] h-[375px] relative">
              <Image
                src={satelliteImageUrl}
                alt="Satellite Image"
                fill
                className="rounded-md object-cover" priority />
            </div>
            
            {/* Construction goals - right side */}
            <div className="flex flex-col space-y-4 w-[400px]">
              <h2 className="text-lg font-medium">Construction Goals</h2>
              <textarea
                placeholder="Enter your construction goals here..."
                value={constructionGoals}
                onChange={(e) => setConstructionGoals(e.target.value)}
                className="w-full h-[300px] p-3 border rounded-md resize-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[375px] bg-gray-100 rounded-md">
            <p className="text-gray-500">No image available.</p>
          </div>
        )}
        {/* GO button */}
        <div className="flex justify-start mt-6">
          <Button onClick={handleGo} className="bg-primary text-primary-foreground hover:bg-primary/90 w-[150px] h-10 text-lg">
            GO
          </Button>
      
      </div>
    </SidebarLayout>
  );
};

export default SatelliteImagePage;