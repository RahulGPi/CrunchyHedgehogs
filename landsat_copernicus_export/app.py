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
    print(f"Project Name: {project_name}, Latitude: {latitude}, Longitude: {longitude}, Location Name: {location_name}")  # Replace with database logic
    return jsonify({"success": True, "projectname": project_name})

if __name__ == '__main__':
    app.run(port=5000, debug=True)