import { NextResponse } from 'next/server';
import { list_project_files } from 'api/default';

export async function GET() {
    try {
        const response = await list_project_files({ path: 'landsat_copernicus_export/frontend/public' });

        if (response.status === 'succeeded' && response.result) {
            const files = JSON.parse(response.result) as string[];

            // Extract image files and handle potential undefined values
            const imageFiles = files
                .filter(file => {
                    const lowerCaseFile = file.toLowerCase();
                    return (
                        lowerCaseFile.endsWith('.png') ||
                        lowerCaseFile.endsWith('.jpg') ||
                        lowerCaseFile.endsWith('.jpeg') ||
                        lowerCaseFile.endsWith('.gif') ||
                        lowerCaseFile.endsWith('.bmp')
                    );
                })
                .map(file => file.split('/').pop())
                .filter(fileName => fileName !== undefined) as string[];

            return NextResponse.json({ images: imageFiles });
        } else {
            return NextResponse.json({ error: 'Failed to list project files' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error fetching image list:', error);
        return NextResponse.json({ error: 'Failed to fetch image list' }, { status: 500 });
    }
}