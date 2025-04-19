import { NextResponse } from 'next/server';
import { default_api } from '@/api/api';

export async function GET() {
  try {
    const response = await default_api.list_project_files({ path: 'landsat_copernicus_export/frontend/public' });

    if (response.status === 'succeeded') {
        const files = response.result ? JSON.parse(response.result) : [];
        const imageFiles = files
            .filter((file: string) => {
                const lowerCaseFile = file.toLowerCase();
                return (
                    lowerCaseFile.endsWith('.png') ||
                    lowerCaseFile.endsWith('.jpg') ||
                    lowerCaseFile.endsWith('.jpeg') ||
                    lowerCaseFile.endsWith('.gif') ||
                    lowerCaseFile.endsWith('.bmp')
                );
            })
            .map((file: string) => file.split('/').pop() as string);
        return NextResponse.json({ images: imageFiles });
    } else {
        return NextResponse.json({ error: 'Failed to list project files' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching image list:', error);
    return NextResponse.json({ error: 'Failed to fetch image list' }, { status: 500 });
  }
}