import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix leaflet marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function MapComponent() {
  const [projectName, setProjectName] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView([20, 77], 5);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);

    // Click handler for map
    mapInstance.current.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      // Update or create marker
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(mapInstance.current);
      }

      // Process coordinates when project name exists
      if (projectName) {
        processCoordinates(lat, lng);
      }
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [projectName]);

  const processCoordinates = async (lat, lng) => {
    try {
      const response = await axios.post('/api/process', {
        lat,
        lon: lng,
        project_name: projectName
      });

      // Display the new image
      setImageUrl(`/images/${response.data.image}?t=${Date.now()}`);
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.error || "Failed to process coordinates");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (markerRef.current && projectName) {
      const latLng = markerRef.current.getLatLng();
      processCoordinates(latLng.lat, latLng.lng);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          required
          style={{ padding: '8px', flexGrow: 1 }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Process
        </button>
      </form>

      <div ref={mapRef} style={{ height: '500px', width: '100%' }} />

      {imageUrl && (
        <div>
          <h3>Generated Landsat Image:</h3>
          <img 
            src={imageUrl} 
            alt="Landsat" 
            style={{ maxWidth: '100%', border: '1px solid #ccc' }} 
          />
        </div>
      )}
    </div>
  );
}