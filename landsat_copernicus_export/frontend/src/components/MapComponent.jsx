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
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [areaName, setAreaName] = useState(null);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const rectangleRef = useRef(null);

  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    mapInstance.current = L.map(mapRef.current).setView([20, 77], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance.current);

    mapInstance.current.on('click', async (e) => {
      const { lat, lng } = e.latlng;

      // Remove existing marker and rectangle
      if (markerRef.current) {
        mapInstance.current.removeLayer(markerRef.current);
      }
      if (rectangleRef.current) {
        mapInstance.current.removeLayer(rectangleRef.current);
      }

      // Fetch area name
      const area = await fetchAreaName(lat, lng);
      setAreaName(area);
      setSelectedLocation({ lat, lng });

      // Create marker
      const marker = L.marker([lat, lng]).addTo(mapInstance.current);
      const bounds = [
        [lat - 0.01, lng - 0.01],
        [lat + 0.01, lng + 0.01],
      ];
      const rectangle = L.rectangle(bounds, {
        color: "#228B22",
        weight: 1
      }).addTo(mapInstance.current);

      const tooltipContent = `
        <div style="
          background-color: #a8d5a8;
          padding: 10px;
          border-radius: 8px;
          font-weight: bold;
          min-width: 150px;
        ">
          🌍 ${area || 'Unknown Area'} <br />
          🧭 ${lat.toFixed(5)}, ${lng.toFixed(5)}
        </div>
      `;
      marker.bindTooltip(tooltipContent, {
        permanent: false,
        direction: 'top',
        opacity: 0.9
      }).openTooltip();

      markerRef.current = marker;
      rectangleRef.current = rectangle;
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const fetchAreaName = async (lat, lon) => {
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat,
          lon,
          format: 'json'
        }
      });
      return res.data.display_name || 'Unknown Area';
    } catch (err) {
      console.error("Error fetching area name:", err);
      return 'Unknown Area';
    }
  };

  const processCoordinates = async (lat, lng) => {
    try {
      const response = await axios.post('/api/process', {
        lat,
        lon: lng,
        project_name: projectName
      });
      setImageUrl(`/images/${response.data.image}?t=${Date.now()}`);
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.error || "Failed to process coordinates");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedLocation || !projectName.trim()) return;
    processCoordinates(selectedLocation.lat, selectedLocation.lng);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

      {/* Location Info Panel */}
      <div style={{
        width: '300px',
        height: '100%',
        overflowY: 'auto',
        borderLeft: '1px solid #ddd',
        padding: '10px',
        background: '#f8f8f8',
        borderRadius: '8px'
      }}>
        <h3>📍 Selected Location</h3>
        {selectedLocation ? (
          <div>
            <strong>{areaName}</strong><br />
            <small>
              Lat: {selectedLocation.lat.toFixed(5)}<br />
              Lng: {selectedLocation.lng.toFixed(5)}
            </small>
          </div>
        ) : (
          <p>No location selected yet.</p>
        )}
      </div>
    </div>
  );
}
