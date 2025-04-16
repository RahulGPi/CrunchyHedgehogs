# Configuration settings shared across modules

# Earth Engine initialization settings
EE_PROJECT = "ee-rahulpaiai23"

# Default export settings
EXPORT_SETTINGS = {
    'scale': 10,
    'maxPixels': 1e13
}

# Landsat settings
LANDSAT_SETTINGS = {
    'collection': 'LANDSAT/LC09/C02/T1_L2',
    'date_range': ('2022-01-01', '2022-02-01'),
    'max_cloud_cover': 5,
    'visualization': {
        'min': 0.0,
        'max': 0.35,
    
    },
    'rgb_bands': ['SR_B4', 'SR_B3', 'SR_B2'],
    'export_folder': 'LandsatExports'
}

# Copernicus settings
COPERNICUS_SETTINGS = {
    'image_id': 'ESA/WorldCover/v200',
    'band': 'Map',
    'visualization': {
        'min': 0,
        'max': 100,
        # 'palette': [
        #     '006400', 'ffbb22', 'ffff4c', 'f096ff', 'fa0000', 
        #     'b4b4b4', 'f0f0f0', '0064c8', '0096a0', '00cf75', 
        #     'fae6a0', 'b40000', '702200', 'b4d79e'
        # ]
    },
    'export_folder': 'CopernicusExports'
}

DRIVE_SETTINGS = {
    'token_file': 'token.json',
    'download_dir': 'downloaded_images',
    'landsat_dir': 'landsat_images',       # NEW: Landsat subfolder
    'copernicus_dir': 'copernicus_images', # NEW: Copernicus subfolder
    'wait_timeout': 600,
    'poll_interval': 10,
    'image_conversion': {
        'delete_original': True,  # Whether to delete TIFF after conversion
        'quality': 100,           # PNG quality (1-100)
        'resize': None           # Optional: (width, height) or None
    }
}