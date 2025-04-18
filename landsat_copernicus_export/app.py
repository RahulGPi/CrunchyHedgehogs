import os
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Configure paths
LANDSAT_IMAGE_DIR = os.path.join('landsat_copernicus_export', 'downloaded_images', 'landsat_images')
os.makedirs(LANDSAT_IMAGE_DIR, exist_ok=True)

@app.route('/api/process', methods=['POST'])
def process_coords():
    data = request.json
    lat = data.get('lat')
    lon = data.get('lon')
    project_name = data.get('project_name', 'default')

    if not lat or not lon:
        return jsonify({"error": "Missing coordinates"}), 400

    # Call your existing function (modify as needed)
    from main import process_coordinates
    process_coordinates([(lat, lon)], project_name)

    # Return the latest Landsat image (adjust logic as needed)
    landsat_images = os.listdir(LANDSAT_IMAGE_DIR)
    if not landsat_images:
        return jsonify({"error": "No images found"}), 404

    latest_image = sorted(landsat_images)[-1]  # Get most recent
    return jsonify({"image": latest_image})

@app.route('/images/<filename>')
def get_image(filename):
    return send_from_directory(LANDSAT_IMAGE_DIR, filename)

if __name__ == "__main__":
    app.run()