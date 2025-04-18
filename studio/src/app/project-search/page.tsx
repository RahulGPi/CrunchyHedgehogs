"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function ProjectSearchPage() {
  const router = useRouter();

  const handleCreateProject = () => {
    router.push("/new-project");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-4">Project Search</h1>
      <div className="flex flex-col space-y-4 w-full max-w-md">
        <Input type="text" placeholder="Search Projects" className="mb-4" />
        <Button onClick={handleCreateProject} variant="secondary">
          Create New Project
        </Button>
      </div>
    </div>
  );
}
