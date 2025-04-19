"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SidebarLayout from "@/components/sidebar-layout";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ProjectDataPage = () => {
  const router = useRouter();
  const satelliteImageUrl = "https://picsum.photos/400/300";
  const permissions = "Received all necessary permits.";
  const costMetricsChart = "https://picsum.photos/400/300";
  const timeMetricsChart = "https://picsum.photos/400/300";

  const handleSave = () => {
    router.push("/dashboard");
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle>Satellite Map</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={satelliteImageUrl}
              alt="Satellite Map"
              className="rounded-md shadow-md"
            />
          </CardContent>
        </Card>

        {/* Cost Metrics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={costMetricsChart}
              alt="Cost Metrics Chart"
              className="rounded-md shadow-md"
            />
          </CardContent>
        </Card>

        {/* Time Metrics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Time Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={timeMetricsChart}
              alt="Time Metrics Chart"
              className="rounded-md shadow-md"
            />
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{permissions}</p>
          </CardContent>
        </Card>

        {/* AI-Generated Report */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Project Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Generating report...</p>
          </CardContent>
        </Card>
        <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/80">
          Save
        </Button>
      </div>
    </SidebarLayout>
  );
};

export default ProjectDataPage;
