"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface Point {
  x: number;
  y: number;
}

interface ImageSelectorProps {
  imageUrl: string;
  onSelectionComplete: (points: Point[]) => void;
}

const ImageSelector = ({ imageUrl, onSelectionComplete }: ImageSelectorProps) => {
  const [points, setPoints] = useState<Point[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match image
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw image on canvas
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Draw current selection
    if (points.length > 0) {
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      
      if (points.length === 4) {
        ctx.closePath();
      }
      ctx.stroke();
    }
  }, [points]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (points.length >= 4) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints([...points, { x, y }]);
  };

  const resetSelection = () => {
    setPoints([]);
  };

  const completeSelection = () => {
    if (points.length === 4) {
      onSelectionComplete(points);
    }
  };

  return (
    <div className="relative">
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Satellite"
        className="hidden"
        onLoad={() => {
          const canvas = canvasRef.current;
          const image = imageRef.current;
          if (canvas && image) {
            canvas.width = image.width;
            canvas.height = image.height;
          }
        }}
      />
      
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="border rounded-md w-full h-auto max-h-[500px]"
      />
      
      <div className="mt-4 flex gap-2">
        <Button 
          onClick={resetSelection}
          variant="outline"
          disabled={points.length === 0}
        >
          Reset
        </Button>
        <Button 
          onClick={completeSelection}
          disabled={points.length !== 4}
        >
          Confirm Selection
        </Button>
      </div>
      
      {points.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">
            Selected points: {points.map(p => `(${Math.round(p.x)},${Math.round(p.y)})`).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;