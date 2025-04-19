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
  projectId: string;
}

const ImageSelector = ({ imageUrl, onSelectionComplete, projectId }: ImageSelectorProps) => {
  const [points, setPoints] = useState<Point[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Draw the image and current selection
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = imageRef.current;

    if (!canvas || !ctx || !image) return;

    // Clear canvas and redraw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Only draw if we have at least 2 points
    if (points.length >= 2) {
      ctx.strokeStyle = '#0000FF';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';

      // Draw polygon
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      // Close the path if we have at least 3 points
      if (points.length >= 3) {
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.stroke();

      // Draw points
      ctx.fillStyle = '#0000FF';
      points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [points]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Ensure point is within canvas bounds
    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
      setPoints(prev => [...prev, { x, y }]);
    }
  };

  const handleSelectionComplete = () => {
    if (points.length >= 3) {
      onSelectionComplete([...points]);
      setPoints([]);
    }
  };

  return (
    <div className="relative">
      {/* Hidden image used for reference */}
      <img 
        ref={imageRef}
        src={imageUrl}
        alt="Satellite View"
        style={{ display: 'none' }}
        onLoad={() => {
          const canvas = canvasRef.current;
          const image = imageRef.current;
          if (!canvas || !image) return;

          // Set canvas dimensions to match image natural size
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
        }}
      />

      {/* Visible canvas for interaction */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="border border-gray-400 cursor-crosshair w-full h-auto"
        style={{ maxWidth: '100%' }}
      />

      {/* Complete selection button */}
      {points.length >= 3 && (
        <div className="absolute bottom-4 right-4">
          <Button 
            onClick={handleSelectionComplete}
            variant="default"
            size="sm"
          >
            Complete Selection
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;