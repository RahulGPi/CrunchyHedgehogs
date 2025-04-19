"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SidebarLayout from "@/components/sidebar-layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter, // Import AlertDialogFooter
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react";

interface Project {
  id: number;
  name: string;
  location: string;
}

const ProjectDashboard = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: "Project A", location: "Location 1" },
    { id: 2, name: "Project B", location: "Location 2" },
  ]);
  const [projectIdToDelete, setProjectIdToDelete] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const handleCreateProject = () => {
    router.push("/new-project");
  };

  const handleDeleteConfirmation = (projectId: number) => {
    setProjectIdToDelete(projectId);
    setOpen(true);
  };


  const handleDeleteProject = () => {
    if (projectIdToDelete !== null) {
      setProjects(projects.filter((project) => project.id !== projectIdToDelete));
      setOpen(false);
      setProjectIdToDelete(null);
    }
  };

  return (
    <SidebarLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-4">
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-1/3"
          />
          <Button onClick={handleCreateProject} className="bg-primary text-primary-foreground hover:bg-primary/80">
            Create New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow duration-200 relative">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.location}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Project details or a brief summary can go here */}
              </CardContent>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleDeleteConfirmation(project.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </Card>
          ))}
        </div>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Are you sure you want to permanently delete this project?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProject}>Yes, Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SidebarLayout>
  );
};

export default ProjectDashboard;
