"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Project Voyager</h1>
      <p className="text-lg mb-8">
        Explore the world through satellite imagery.
      </p>
      <Button onClick={() => router.push("/login")} variant="accent">
        Sign In
      </Button>
    </div>
  );
}
