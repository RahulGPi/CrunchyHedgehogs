import ee
from config import EE_PROJECT, DRIVE_SETTINGS
from image_utils import ImageConverter

# Initialize Earth Engine
ee.Initialize(project=EE_PROJECT)

def create_roi(lat, lon, buffer_size=3000):
    """
    Create a circular region of interest around given coordinates
    Args:
        lat, lon: Center coordinates
        buffer_size: Radius in meters
    Returns:
        ee.Geometry: Circular ROI
    """
    point = ee.Geometry.Point([lon, lat])
    return point.buffer(buffer_size)

def get_roi_bounds(roi):
    """
    Get the bounding coordinates of an ROI
    Args:
        roi: ee.Geometry object
    Returns:
        list: Bounding coordinates
    """
    return roi.bounds().getInfo()['coordinates']

def process_roi(points, project_name):
    """
    Process the ROI using the create_roi_image method to create a image.
    Args:
        points (list): A list of points to draw the ROI
        project_name (str): The name of the project to which the ROI belongs
    Returns:
        str: The image path of the generated ROI image.
    """
    image_path = create_roi_image(points, project_name)
    return image_path

def create_roi_image(points, project_name):
    """
    Creates an image of the ROI defined by the given points.
    Args:
        points (list): A list of points to draw the ROI
        project_name (str): The name of the project to which the ROI belongs
    Returns:
        str: The path to the saved ROI image.
    """
    a = ImageConverter
    image_path = a.roi_definer(points, project_name)
    return image_path