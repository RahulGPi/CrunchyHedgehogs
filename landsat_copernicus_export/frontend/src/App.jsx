import MapComponent from './components/MapComponent';
import './App.css';

function App() {
  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Landsat Image Generator</h1>
      <div style={{ height: '70vh', width: '100%' }}>
        <MapComponent />
      </div>
    </div>
  );
}

export default App;