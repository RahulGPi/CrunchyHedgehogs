"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Particles from "react-tsparticles";
import { loadTrianglesPreset } from "tsparticles-preset-triangles";
import { useCallback } from "react";

export default function Home() {
  const router = useRouter();

  const particlesInit = useCallback(async engine => {
    await loadTrianglesPreset(engine);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-secondary overflow-hidden">
       <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: "#f5f5f5", // Light Gray
            },
          },
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                area: 800,
              },
            },
            color: {
              value: "#228B22", // Earthy Green
            },
            shape: {
              type: "triangle",
            },
            opacity: {
              value: 0.8,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false,
              },
            },
            size: {
              value: 4,
              random: true,
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#008080", // Teal
              opacity: 0.4,
              width:4 ,
            },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: true,
                mode: "repulse",
              },
              onclick: {
                enable: true,
                mode: "push",
              },
              resize: true,
            },
            modes: {
              repulse: {
                distance: 200,
                duration: 0.4,
              },
              push: {
                particles_nb: 4,
              },
            },
          },
          retina_detect: true,
        }}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      />
      <h1 className="text-4xl font-bold mb-10 z-10" style={{ color: "#228B22", fontSize: "72px" }}>TERRAFLOW</h1>
      <p className="text-lg mb-20 z-10" style={{ color: "#228B22", fontSize: "45px" }}>
        Mapping Progress, effortlessly!
      </p>
      <Button onClick={() => router.push("/login")} className="bg-primary text-primary-foreground hover:bg-primary/80 z-10" style={{fontSize: "25px", padding: "20px 40px"}}>
        Sign In
      </Button>
    </div>
  );
}



