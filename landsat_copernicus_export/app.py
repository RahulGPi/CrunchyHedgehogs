from flask import Flask, request, jsonify
import os

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
    data = request.json
    project_name = data.get('projectName')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    location_name = data.get('locationName')    
    # Create a 'projects' folder if it doesn't exist
    projects_dir = 'landsat_copernicus_export/projects'  # Changed path here
    if not os.path.exists(projects_dir):
        os.makedirs(projects_dir)
    # Create a file with the project name and save the details
    file_path = os.path.join(projects_dir, f"{project_name}.txt")
    with open(file_path, 'w') as f:
        f.write(f"Latitude: {latitude}\n")
        f.write(f"Longitude: {longitude}\n")
        f.write(f"Location Name: {location_name}\n")
        
    return jsonify({"success": True, "projectname": project_name, "latitude": latitude, "longitude": longitude})

if __name__ == '__main__':
    app.run(port=5000, debug=True)