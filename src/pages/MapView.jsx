import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { placeTypes } from '../data/mockData';
import Avatar from '../components/Avatar';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createColorIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function createPersonIcon(name) {
  const colors = ['#10b981', '#3b82f6', '#a855f7', '#f59e0b', '#14b8a6', '#f97316', '#ef4444'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:14px;">${name.charAt(0)}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

const filters = ['all', 'people', 'places', 'events'];

export default function MapView() {
  const { user, allUsers, allPlaces, allEvents } = useApp();
  const [filter, setFilter] = useState('all');
  const [selectedPlaceType, setSelectedPlaceType] = useState('all');
  const center = [user.location.lat, user.location.lng];

  const otherUsers = allUsers.filter((u) => u.id !== user.id);

  return (
    <div className="pb-20 pt-16">
      <div className="px-4 py-3 space-y-3">
        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setSelectedPlaceType('all'); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Place Type Filter */}
        {filter === 'places' && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedPlaceType('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                selectedPlaceType === 'all' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}
            >
              All
            </button>
            {Object.entries(placeTypes).map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => setSelectedPlaceType(key)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  selectedPlaceType === key ? 'text-white' : 'bg-slate-100 text-slate-500'
                }`}
                style={selectedPlaceType === key ? { backgroundColor: color } : {}}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Map */}
        <div className="h-[calc(100vh-200px)] rounded-xl overflow-hidden shadow-lg border border-slate-200">
          <MapContainer center={center} zoom={12} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Current user */}
            <Marker
              position={[user.location.lat, user.location.lng]}
              icon={L.divIcon({
                className: 'custom-marker',
                html: '<div style="background:#10b981;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 3px #10b981,0 2px 8px rgba(0,0,0,0.3);"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              })}
            >
              <Popup>
                <div className="text-center">
                  <strong>You are here</strong>
                  <br />
                  <span className="text-xs">{user.location.city}, {user.location.state}</span>
                </div>
              </Popup>
            </Marker>

            {/* 10-mile radius circle */}
            <Circle
              center={center}
              radius={16093}
              pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.05, weight: 1, dashArray: '5,5' }}
            />

            {/* Other users */}
            {(filter === 'all' || filter === 'people') &&
              otherUsers.map((u) => (
                <Marker
                  key={u.id}
                  position={[u.location.lat, u.location.lng]}
                  icon={createPersonIcon(u.name)}
                >
                  <Popup>
                    <div className="text-center min-w-[120px]">
                      <strong>{u.name}</strong>
                      <br />
                      <span className="text-xs text-gray-500">{u.location.city}</span>
                      <br />
                      <span className="text-xs">{u.distance} mi away</span>
                      <br />
                      <div className="flex flex-wrap gap-1 mt-1 justify-center">
                        {u.interests.slice(0, 3).map((i) => (
                          <span key={i} className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">{i}</span>
                        ))}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* Places */}
            {(filter === 'all' || filter === 'places') &&
              allPlaces
                .filter((p) => selectedPlaceType === 'all' || p.type === selectedPlaceType)
                .map((place) => (
                  <Marker
                    key={place.id}
                    position={[place.lat, place.lng]}
                    icon={createColorIcon(placeTypes[place.type]?.color || '#64748b')}
                  >
                    <Popup>
                      <div className="min-w-[140px]">
                        <strong>{place.name}</strong>
                        <br />
                        <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded-full">{placeTypes[place.type]?.label}</span>
                        {place.cost && <span className="text-xs ml-1">&middot; {place.cost}</span>}
                        <br />
                        <span className="text-xs text-gray-500">{place.description}</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}

            {/* Events */}
            {(filter === 'all' || filter === 'events') &&
              allEvents.map((event) => (
                <Marker
                  key={event.id}
                  position={[event.lat, event.lng]}
                  icon={createColorIcon('#f59e0b')}
                >
                  <Popup>
                    <div className="min-w-[140px]">
                      <strong>{event.name}</strong>
                      <br />
                      <span className="text-xs">{event.date} at {event.time}</span>
                      <br />
                      <span className="text-xs text-gray-500">{event.location}</span>
                      <br />
                      <span className="text-xs">{event.attendees} attending</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
