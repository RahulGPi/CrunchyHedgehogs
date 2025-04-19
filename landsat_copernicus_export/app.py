from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import uuid
import threading
# from werkzeug.utils import secure_filename
from config import EE_PROJECT, LANDSAT_SETTINGS, COPERNICUS_SETTINGS, DRIVE_SETTINGS
from roi_utils import create_roi
from main import process_coordinates
from landsat_export import process_landsat_image
from copernicus_export import process_copernicus_image
from drive_utils import DriveManager
from image_utils import ImageConverter
from gemini import algorithm

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'landsat_copernicus_export\\frontend\\public\\leaflet'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'tif', 'tiff'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return "TerraFlow Backend Server"

@app.route('/api/process_coordinates', methods=['POST'])
def process_coordinates_router():
    try:
        data = request.json
        if not data or 'coordinates' not in data or 'project_name' not in data:
            return jsonify({'error': 'Invalid request data'}), 400

        coordinates = data['coordinates']
        project_name = data.get('project_name', str(uuid.uuid4()))

        # Start processing in a background thread
        thread = threading.Thread(
            target=process_coordinates_background,
            args=(coordinates, project_name)
        )
        thread.start()

        return jsonify({
            'message': 'Processing started',
            'project_name': project_name
        }), 202

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def process_coordinates_background(coord_list, project_name):
    """Background processing of coordinates"""
    try:           
            process_coordinates(coord_list, project_name)
            # Convert to PNG
            
            
    except Exception as e:
        print(f"Error in background processing: {str(e)}")

@app.route('/api/get_project_status/<project_name>', methods=['GET'])
def get_project_status(project_name):
    """Check status of a processing job"""
    try:
        # In a real implementation, you would track job status in a database
        # For this example, we'll just check if files exist
        
        landsat_path = os.path.join(
            DRIVE_SETTINGS['download_dir'], 
            DRIVE_SETTINGS['landsat_dir'],
            f"{project_name}_Landsat_Image.png"
        )
        
        copernicus_path = os.path.join(
            DRIVE_SETTINGS['download_dir'],
            DRIVE_SETTINGS['copernicus_dir'],
            f"{project_name}_Copernicus_Image.png"
        )
        
        landsat_exists = os.path.exists(landsat_path)
        copernicus_exists = os.path.exists(copernicus_path)
        
        return jsonify({
            'project_name': project_name,
            'landsat_ready': landsat_exists,
            'copernicus_ready': copernicus_exists,
            'completed': landsat_exists and copernicus_exists
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<project_name>/<image_type>', methods=['GET'])
def download_image(project_name, image_type):
    """Download processed images"""
    try:
        if image_type not in ['landsat', 'copernicus']:
            return jsonify({'error': 'Invalid image type'}), 400
            
        folder = DRIVE_SETTINGS[f'{image_type}_dir']
        filename = f"{project_name}_{image_type.capitalize()}_Image.png"
        directory = os.path.join(DRIVE_SETTINGS['download_dir'], folder)
        
        if not os.path.exists(os.path.join(directory, filename)):
            return jsonify({'error': 'File not found'}), 404
            
        return send_from_directory(directory, filename, as_attachment=True)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add these new endpoints to your existing app.py

@app.route('/api/analyze_image', methods=['POST'])
def analyze_image():
    try:
        data = request.json
        project_name = data.get('project_name')
        
        if not project_name:
            return jsonify({'error': 'Project name required'}), 400
        
        # Run Gemini analysis
        result = algorithm(project_name)
        
        return jsonify({
            'coordinates': result,
            'message': 'Analysis complete'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/process_roi', methods=['POST'])
def process_roi():
    try:
        data = request.json
        project_name = data.get('project_name')
        points = data.get('points')  # List of (x,y) tuples
        
        if not project_name or not points or len(points) != 4:
            return jsonify({'error': 'Invalid request data'}), 400
        
        converter = ImageConverter()
        
        # Process ROI and highlight points
        image_path = converter.roi_definer(points, project_name)
        highlighted_path = converter.highlight_point_if_inside_polygon(
            image_path, 
            points, 
            data.get('analysis_point'), 
            project_name
        )
        
        return jsonify({
            'image_path': highlighted_path,
            'message': 'ROI processing complete'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Initialize Earth Engine
    import ee
    ee.Initialize(project=EE_PROJECT)
    
    app.run(host='0.0.0.0', port=5000, debug=True)