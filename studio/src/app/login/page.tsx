"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/project-search");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <div className="flex flex-col space-y-4 w-80">
        <Input type="text" placeholder="Username" defaultValue="user123" />
        <Input
          type="password"
          placeholder="Password"
          defaultValue="password123"
        />
        <Button onClick={handleLogin} variant="primary">
          Login
        </Button>
      </div>
    </div>
  );
}
