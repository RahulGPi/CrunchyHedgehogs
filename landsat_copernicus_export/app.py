import os
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from main import process_coordinates  # Your existing function

app = Flask(__name__)

# Configure upload/download folders
UPLOAD_FOLDER = 'uploads'
DOWNLOAD_FOLDER = 'outputs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['DOWNLOAD_FOLDER'] = DOWNLOAD_FOLDER

@app.route('/api/process', methods=['POST'])
def process_coords():
    data = request.json
    lat = data.get('lat')
    lon = data.get('lon')
    project_name = data.get('project_name', 'default_project')

    if not lat or not lon:
        return jsonify({"error": "Missing coordinates"}), 400

    # Process coordinates (modify as needed)
    process_coordinates([(lat, lon)], project_name)

    # Return the generated image path
    image_path = f"{project_name}_Landsat_Image_1.png"
    return jsonify({"image": image_path})

@app.route('/images/<filename>')
def get_image(filename):
    return send_from_directory(app.config['DOWNLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)