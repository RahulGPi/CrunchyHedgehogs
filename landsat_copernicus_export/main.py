import os
from roi_utils import create_roi
from landsat_export import process_landsat_image
from copernicus_export import process_copernicus_image
from drive_utils import DriveManager
from config import COPERNICUS_SETTINGS, LANDSAT_SETTINGS , DRIVE_SETTINGS
from image_utils import ImageConverter

def process_coordinates(coord_list):
    """
    Process a list of coordinates to export both Landsat and Copernicus images,
    then download and clean up from Drive.
    """
    drive_manager = DriveManager()
    
    for i, (lat, lon) in enumerate(coord_list, 1):
        print(f"\nProcessing coordinates {i}: ({lat}, {lon})")
        
        # Create ROI
        roi = create_roi(lat, lon)
        
        # Export images
        landsat_prefix = f'Landsat_Image_{i}'
        copernicus_prefix = f'Copernicus_Image_{i}'
        drive_manager.delete_all_files_in_drive_folder(LANDSAT_SETTINGS['export_folder'])
        drive_manager.delete_all_files_in_drive_folder(COPERNICUS_SETTINGS['export_folder'])
        process_landsat_image(roi, i)
        process_copernicus_image(roi, i)
        
        # Process Landsat export
        print("\nProcessing Landsat export...")
        landsat_path = drive_manager.process_export(
            LANDSAT_SETTINGS['export_folder'],
            landsat_prefix,
            folder_type='landsat'  # NEW: Specify folder type
        )
        
        # Process Copernicus export
        print("\nProcessing Copernicus export...")
        copernicus_path = drive_manager.process_export(
            COPERNICUS_SETTINGS['export_folder'],
            copernicus_prefix,
            folder_type='copernicus'  # NEW: Specify folder type
        )
        
        print(f"\nCompleted processing for coordinate {i}:")
        print(f"Landsat saved to: {landsat_path}")
        print(f"Copernicus saved to: {copernicus_path}")
        print("\nConverting downloaded files to PNG...")
    landsat_converted = ImageConverter.process_directory(
        os.path.join(DRIVE_SETTINGS['download_dir'], DRIVE_SETTINGS['landsat_dir'])
    )
    copernicus_converted = ImageConverter.process_directory(
        os.path.join(DRIVE_SETTINGS['download_dir'], DRIVE_SETTINGS['copernicus_dir'])
    )

    print(f"\nConversion complete:")
    print(f"Landsat PNGs: {len(landsat_converted)} files")
    print(f"Copernicus PNGs: {len(copernicus_converted)} files")



if __name__ == "__main__":
    # Example coordinates
    coordinates = [
        # (-33.8688, 151.2093),  # Example coordinate 1
        # (19.200000, 80.100000)   # Example coordinate 2
        # (12.866704307785797, 74.92592107735125)
        # (44.612379390791055, 7.525144278903881)
        # (12.8659168, 74.92452) sahyadri
        (13.183904195454893, 74.93374807956195)
    ]
    
    # Run the export process
    process_coordinates(coordinates)
    # copernicus resize
    image_path = "D:\\GlobalStoragePro\\CH-2\\CrunchyHedgehogs\\landsat_copernicus_export\\downloaded_images\\copernicus_images\\Copernicus_Image_1.png"
    output_path = "D:\\GlobalStoragePro\\CH-2\\CrunchyHedgehogs\\landsat_copernicus_export\\downloaded_images\\copernicus_images\\Copernicus_Image_1.png"
    ImageConverter.resize_image(image_path, output_path, 467, 334)
    #landsat resize
    image_path = "D:\\GlobalStoragePro\\CH-2\\CrunchyHedgehogs\\landsat_copernicus_export\\downloaded_images\\landsat_images\\Landsat_Image_1.png"
    output_path = "D:\\GlobalStoragePro\\CH-2\\CrunchyHedgehogs\\landsat_copernicus_export\\downloaded_images\\landsat_images\\Landsat_Image_1.png"
    ImageConverter.resize_image(image_path, output_path, 467, 334)