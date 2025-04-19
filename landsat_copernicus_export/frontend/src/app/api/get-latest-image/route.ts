// app/api/get-latest-image/route.ts
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
      const imagesDir = path.join(process.cwd(), 'public', 'project-images');
      const files = await fs.readdir(imagesDir);
  
      // Filter for image files and resolve their stats
      const imageFiles = await Promise.all(
        files
          .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
          .map(async file => {
            const stats = await fs.stat(path.join(imagesDir, file));
            return {
              name: file,
              time: stats.mtime.getTime(), // Properly resolve mtime
            };
          })
      );
  
      // Sort by most recently modified
      imageFiles.sort((a, b) => b.time - a.time);
  
      if (imageFiles.length === 0) {
        return NextResponse.json({ error: 'No images found' }, { status: 404 });
      }
  
      return NextResponse.json({
        imageUrl: `/project-images/${imageFiles[0].name}`,
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch images' },
        { status: 500 }
      );
    }
  }