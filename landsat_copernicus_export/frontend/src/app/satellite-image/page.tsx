"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SidebarLayout from "@/components/sidebar-layout";

const SatelliteImagePage = () => {
  const router = useRouter();
  const [constructionGoals, setConstructionGoals] = useState("");

  const handleGo = () => {
    router.push("/project-data");
  };

  // Placeholder for fetching satellite image from local directory
  const satelliteImageUrl = "https://picsum.photos/800/600"; // Replace with your logic

  return (
    <SidebarLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-semibold mb-4">Project Satellite Image</h1>
        <div className="flex flex-col space-y-4">
          <img
            src={satelliteImageUrl}
            alt="Satellite Image"
            className="rounded-md shadow-md"
          />
          <Input
            type="text"
            placeholder="Enter construction goals..."
            value={constructionGoals}
            onChange={(e) => setConstructionGoals(e.target.value)}
          />
          <Button onClick={handleGo} className="bg-primary text-primary-foreground hover:bg-primary/80">
            Go
          </Button>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default SatelliteImagePage;
