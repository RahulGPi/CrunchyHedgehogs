import os
from roi_utils import create_roi
from landsat_export import process_landsat_image
from copernicus_export import process_copernicus_image
from drive_utils import DriveManager
from config import COPERNICUS_SETTINGS, LANDSAT_SETTINGS , DRIVE_SETTINGS
from image_utils import ImageConverter
from flask import Flask, request, jsonify
import os

def process_coordinates(coord_list, project_name):
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
        landsat_prefix = f'{project_name}_Landsat_Image'
        copernicus_prefix = f'{project_name}_Copernicus_Image'
        drive_manager.delete_all_files_in_drive_folder(LANDSAT_SETTINGS['export_folder'])
        drive_manager.delete_all_files_in_drive_folder(COPERNICUS_SETTINGS['export_folder'])
        process_landsat_image(roi, project_name)
        process_copernicus_image(roi, project_name)
        
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
    

app = Flask(__name__)

@app.route('/api/get-image', methods=['GET'])
def get_image():
    project_name = request.args.get('project')
    image_path = f"landsat_copernicus_export/downloaded_images/landsat_images/{project_name}_Landsat_Image.png"
    
    if not os.path.exists(image_path):
        return jsonify({"error": "Image not found"}), 404
    
    return jsonify({"imagePath": f"/{image_path}"})


@app.route('/api/save-project', methods=['POST'])
def save_project():
    data = request.get_json()  # Use get_json to handle JSON data
    project_name = data.get('projectName')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    location_name = data.get('locationName')    
    
    # Create a 'projects' folder if it doesn't exist
    projects_dir = 'landsat_copernicus_export/projects'
    if not os.path.exists(projects_dir):
        os.makedirs(projects_dir)
    
    # Create a file with the project name and save the details
    file_path = os.path.join(projects_dir, f"{project_name}.txt")
    with open(file_path, 'w') as f:
        f.write(f"Latitude: {latitude}\n")
        f.write(f"Longitude: {longitude}\n")
        f.write(f"Location Name: {location_name}\n")

    # Call process_coordinates to generate the image
    process_coordinates([(float(latitude), float(longitude))], project_name)  # Pass coordinates as a list of tuples
        
    return jsonify({"success": True, "projectname": project_name, "latitude": latitude, "longitude": longitude})


if __name__ == '__main__':
    app.run(debug=True, port = 5000)