"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SidebarLayout from "@/components/sidebar-layout";

const BufferingPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/satellite-image");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SidebarLayout>
      <div className="flex flex-col items-center justify-center h-screen bg-secondary">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4">Loading project data...</p>
      </div>
    </SidebarLayout>
  );
};

export default BufferingPage;

