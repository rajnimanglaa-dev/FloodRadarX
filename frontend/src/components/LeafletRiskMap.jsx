import React, { useState, useEffect, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle, 
  Polygon, 
  Polyline, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Search, 
  Layers, 
  Crosshair, 
  AlertTriangle, 
  Clock, 
  CloudRain, 
  Home, 
  Check, 
  ShieldAlert, 
  ArrowRight,
  Info,
  Navigation,
  Activity,
  Plus,
  Minus
} from 'lucide-react';
import { SEED_REGIONS, SEED_SHELTERS, SEED_MISSIONS, apiService } from '../services/api';

// Child component to imperatively update Map center and zoom
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 11, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom DivIcons for ultra-sharp, no-asset-dependency Leaflet rendering
const createRiskIcon = (riskLevel) => {
  const color = riskLevel === 'High' ? '#ef4444' : riskLevel === 'Moderate' ? '#f59e0b' : '#10b981';
  const pulseHtml = riskLevel === 'High' 
    ? `<span style="position:absolute; width:100%; height:100%; border-radius:50%; background:${color}; opacity:0.6; animation: radar-pulse 2s infinite ease-in-out;"></span>` 
    : '';

  return L.divIcon({
    className: 'custom-risk-icon',
    html: `
      <div style="position:relative; width:34px; height:34px; display:flex; align-items:center; justify-content:center;">
        ${pulseHtml}
        <div style="position:relative; width:26px; height:26px; border-radius:50%; background:${color}; border:2.5px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.5);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });
};

const shelterIcon = L.divIcon({
  className: 'custom-shelter-icon',
  html: `
    <div style="width:28px; height:28px; border-radius:8px; background:#10b981; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.4);">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
});

const rescueIcon = L.divIcon({
  className: 'custom-rescue-icon',
  html: `
    <div style="width:28px; height:28px; border-radius:50%; background:#0284c7; border:2px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.4);">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect width="16" height="10" x="2" y="7" rx="2"></rect>
        <circle cx="6" cy="17" r="2"></circle>
        <circle cx="14" cy="17" r="2"></circle>
      </svg>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
});

export default function LeafletRiskMap({ 
  selectedRegion, 
  onSelectRegion, 
  onOpenDetail, 
  onOpenSos 
}) {
  const [mapType, setMapType] = useState('Satellite'); // 'Satellite' | 'Map' | 'Terrain'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [regions, setRegions] = useState(SEED_REGIONS);
  const [shelters, setShelters] = useState(SEED_SHELTERS);
  const [missions, setMissions] = useState(SEED_MISSIONS);

  // Layer Toggles matching image
  const [layers, setLayers] = useState({
    riskZones: true,
    satelliteImagery: true,
    rivers: true,
    hospitals: true,
    shelters: true,
    rescueTeams: true,
    roadStatus: true,
  });

  const [mapCenter, setMapCenter] = useState([selectedRegion.latitude, selectedRegion.longitude]);
  const [mapZoom, setMapZoom] = useState(11);

  // Sync when prop selectedRegion changes
  useEffect(() => {
    if (selectedRegion) {
      setMapCenter([selectedRegion.latitude, selectedRegion.longitude]);
      setMapZoom(11);
    }
  }, [selectedRegion]);

  // Search logic
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      const filtered = regions.filter(r => 
        r.name.toLowerCase().includes(val.toLowerCase()) || 
        r.state.toLowerCase().includes(val.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectSearchResult = (region) => {
    onSelectRegion(region);
    setMapCenter([region.latitude, region.longitude]);
    setMapZoom(12);
    setSearchQuery(`${region.name}, ${region.state}`);
    setSearchResults([]);
  };

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Tile URL based on map type
  const getTileUrl = () => {
    if (mapType === 'Satellite') {
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (mapType === 'Terrain') {
      return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    }
    // Sleek Carto Dark / Voyager
    return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  };

  // Simulated Ghaggar & Sutlej river coordinates in Punjab for water layer
  const riverPathGhaggar = [
    [30.8500, 76.9000],
    [30.6500, 76.7500],
    [30.4500, 76.5500],
    [30.3400, 76.4000],
    [30.2200, 76.2500],
    [29.9800, 76.0500]
  ];

  const safeCorridorNH7 = [
    [30.6000, 76.8500],
    [30.4839, 76.5939],
    [30.3398, 76.3869],
    [30.2500, 76.1500]
  ];

  const floodedSectorRoad = [
    [30.3450, 76.4100],
    [30.3350, 76.3800],
    [30.3200, 76.3650]
  ];

  // Flood Risk polygon zone around Patiala
  const floodRiskZonePatiala = [
    [30.3800, 76.3400],
    [30.3900, 76.4300],
    [30.3200, 76.4600],
    [30.2900, 76.4100],
    [30.3000, 76.3300]
  ];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden flex flex-col">
      
      {/* Top Header Floating Controls Bar (Matching Reference Image) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none">
        
        {/* Search Bar with Autocomplete */}
        <div className="relative w-full md:w-96 pointer-events-auto">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search location (e.g. Patiala, Ludhiana)..."
              className="w-full bg-slate-900/95 border border-cyan-500/40 focus:border-cyan-400 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-400 shadow-xl backdrop-blur-md outline-none transition-all"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-1.5 left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1 z-30">
              {searchResults.map(reg => (
                <button
                  key={reg.id}
                  onClick={() => handleSelectSearchResult(reg)}
                  className="w-full px-3.5 py-2 text-left text-xs hover:bg-slate-800 flex items-center justify-between text-slate-200"
                >
                  <span className="font-medium">{reg.name}, {reg.state}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    reg.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {reg.riskLevel}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Type Switcher Pills & Zoom Controls (Matching Image) */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-xl shadow-xl backdrop-blur-md">
          {['Satellite', 'Map', 'Terrain'].map((type) => (
            <button
              key={type}
              onClick={() => setMapType(type)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mapType === type
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {type}
            </button>
          ))}

          <div className="w-[1px] h-5 bg-slate-700 mx-1" />

          {/* Target / Locate Button */}
          <button
            onClick={() => {
              setMapCenter([30.3398, 76.3869]);
              setMapZoom(12);
            }}
            title="Focus Current Location (Patiala)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Left Floating "Map Layers" Control Panel (Matching Image Exactly) */}
      <div className="absolute top-20 left-4 z-20 w-64 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl pointer-events-auto space-y-3.5 max-h-[calc(100vh-10rem)] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Map Layers</h4>
          </div>
          <span className="text-[10px] text-cyan-400 font-medium">Interactive</span>
        </div>

        {/* Checkbox Options matching image */}
        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer hover:text-white select-none">
            <input
              type="checkbox"
              checked={layers.riskZones}
              onChange={() => toggleLayer('riskZones')}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Flood Risk Zones</span>
          </label>

          <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer hover:text-white select-none">
            <input
              type="checkbox"
              checked={layers.satelliteImagery}
              onChange={() => toggleLayer('satelliteImagery')}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Satellite Imagery</span>
          </label>

          <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer hover:text-white select-none">
            <input
              type="checkbox"
              checked={layers.rivers}
              onChange={() => toggleLayer('rivers')}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Rivers & Water</span>
          </label>

          <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer hover:text-white select-none">
            <input
              type="checkbox"
              checked={layers.hospitals}
              onChange={() => toggleLayer('hospitals')}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Hospitals</span>
          </label>

          <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer hover:text-white select-none">
            <input
              type="checkbox"
              checked={layers.shelters}
              onChange={() => toggleLayer('shelters')}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Shelters</span>
          </label>

          <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer hover:text-white select-none">
            <input
              type="checkbox"
              checked={layers.rescueTeams}
              onChange={() => toggleLayer('rescueTeams')}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Rescue Teams</span>
          </label>

          <label className="flex items-center gap-2.5 text-slate-200 cursor-pointer hover:text-white select-none">
            <input
              type="checkbox"
              checked={layers.roadStatus}
              onChange={() => toggleLayer('roadStatus')}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Road Status</span>
          </label>
        </div>

        {/* Legend matching image: Low, Moderate, High */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Risk Severity
          </div>
          <div className="space-y-1.5 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Low Risk (&lt; 40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Moderate Risk (40 - 75%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>High Risk (&gt; 75%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Leaflet Interactive Map Container */}
      <div className="w-full h-full relative z-10">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          zoomControl={false}
          className="w-full h-full"
        >
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={getTileUrl()}
          />

          {/* 1. Rivers & Water Layer */}
          {layers.rivers && (
            <Polyline
              positions={riverPathGhaggar}
              pathOptions={{ color: '#06b6d4', weight: 4, opacity: 0.8, dashArray: '4 4' }}
            />
          )}

          {/* 2. Road Status Layer: Green Safe Corridor & Red Inundated Road */}
          {layers.roadStatus && (
            <>
              {/* Safe NH 7 Corridor */}
              <Polyline
                positions={safeCorridorNH7}
                pathOptions={{ color: '#10b981', weight: 4, opacity: 0.9 }}
              />
              {/* Flooded Sector Road */}
              <Polyline
                positions={floodedSectorRoad}
                pathOptions={{ color: '#ef4444', weight: 4, opacity: 0.9, dashArray: '6 6' }}
              />
            </>
          )}

          {/* 3. Flood Risk Zones (Polygonal Overlay & Heat circles) */}
          {layers.riskZones && (
            <>
              <Polygon
                positions={floodRiskZonePatiala}
                pathOptions={{
                  fillColor: '#ef4444',
                  fillOpacity: 0.35,
                  color: '#dc2626',
                  weight: 2
                }}
              />
              {regions.map((reg) => (
                <Circle
                  key={`circle-${reg.id}`}
                  center={[reg.latitude, reg.longitude]}
                  radius={reg.riskLevel === 'High' ? 12000 : 7000}
                  pathOptions={{
                    fillColor: reg.riskLevel === 'High' ? '#ef4444' : reg.riskLevel === 'Moderate' ? '#f59e0b' : '#10b981',
                    fillOpacity: 0.25,
                    color: reg.riskLevel === 'High' ? '#dc2626' : reg.riskLevel === 'Moderate' ? '#d97706' : '#059669',
                    weight: 1.5
                  }}
                />
              ))}
            </>
          )}

          {/* 4. Region Markers with Interactive Popup matching image */}
          {regions.map((reg) => (
            <Marker
              key={reg.id}
              position={[reg.latitude, reg.longitude]}
              icon={createRiskIcon(reg.riskLevel)}
            >
              {/* Interactive Popup Card (Matching Reference Image Exactly) */}
              <Popup>
                <div className="p-4 w-64 bg-slate-900 text-slate-100 rounded-xl space-y-3 font-sans">
                  
                  {/* Top Header: Pin & Region Name */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-white text-base leading-snug">
                        {reg.name}, {reg.state}
                      </h4>
                      <span className={`inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        reg.riskLevel === 'High' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        ● {reg.riskLevel} Risk
                      </span>
                    </div>
                  </div>

                  {/* Arrival & Rainfall rows matching image */}
                  <div className="space-y-1.5 text-xs text-slate-300 pt-1 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>
                        Est. Flood Arrival: <strong className="text-white">{reg.arrivalEstimateHours} – {reg.arrivalEstimateHours + 0.5} hrs</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>
                        Rainfall: <strong className="text-white">{reg.rainfallMm} mm</strong>
                      </span>
                    </div>
                  </div>

                  {/* Action Button: View Details (Matching Image) */}
                  <div className="pt-2">
                    <button
                      onClick={() => onOpenDetail(reg)}
                      className="w-full py-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </Popup>
            </Marker>
          ))}

          {/* 5. Shelters Markers */}
          {layers.shelters && shelters.map((sh) => (
            <Marker
              key={`shelter-${sh.id}`}
              position={[sh.latitude, sh.longitude]}
              icon={shelterIcon}
            >
              <Popup>
                <div className="p-3 w-56 bg-slate-900 text-slate-100 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{sh.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Capacity: <strong className="text-emerald-400">{sh.currentOccupancy} / {sh.capacity}</strong>
                  </div>
                  <div className="text-[11px] text-slate-400">{sh.facilities}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">Contact: {sh.contactNumber}</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* 6. Rescue Teams Markers */}
          {layers.rescueTeams && missions.map((ms) => (
            <Marker
              key={`mission-${ms.id}`}
              position={ms.coords}
              icon={rescueIcon}
            >
              <Popup>
                <div className="p-3 w-56 bg-slate-900 text-slate-100 rounded-xl space-y-1.5 text-xs">
                  <div className="font-bold text-white">{ms.title} - {ms.priority}</div>
                  <div className="text-slate-300">Location: {ms.location} ({ms.peopleCount} people)</div>
                  <div className="text-cyan-400 font-semibold">{ms.assignedTeam} ({ms.status})</div>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>
      </div>

    </div>
  );
}
