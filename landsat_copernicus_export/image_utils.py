import os
from PIL import Image
import rasterio
from config import DRIVE_SETTINGS

class ImageConverter:
    @staticmethod
    def tif_to_png(tif_path):
        """Convert TIFF to PNG while preserving geospatial data"""
        try:
            # Create output path
            png_path = os.path.splitext(tif_path)[0] + '.png'
            
            # Read TIFF with rasterio to handle geospatial data
            with rasterio.open(tif_path) as src:
                # Read all bands
                data = src.read()
                profile = src.profile
            
            # Convert to PNG (using first 3 bands for RGB)
            if len(data) >= 3:
                rgb_data = data[:3]  # Take first 3 bands
                rgb_data = rgb_data.transpose(1, 2, 0)  # Change to HWC format
                
                # Normalize to 0-255 range
                rgb_data = ((rgb_data - rgb_data.min()) * (255 / (rgb_data.max() - rgb_data.min()))).astype('uint8')
                
                # Save as PNG
                Image.fromarray(rgb_data).save(png_path)
                print(f"Converted {os.path.basename(tif_path)} to PNG")
                
                # Optionally delete original TIFF
                os.remove(tif_path)
                return png_path
            else:
                print(f"Not enough bands in {tif_path} for RGB conversion")
                return None
                
        except Exception as e:
            print(f"Failed to convert {tif_path}: {str(e)}")
            return None

    @staticmethod
    def process_directory(directory):
        """Convert all TIFFs in a directory to PNGs"""
        converted_files = []
        for filename in os.listdir(directory):
            if filename.lower().endswith('.tif') or filename.lower().endswith('.tiff'):
                tif_path = os.path.join(directory, filename)
                png_path = ImageConverter.tif_to_png(tif_path)
                if png_path:
                    converted_files.append(png_path)
        return converted_files