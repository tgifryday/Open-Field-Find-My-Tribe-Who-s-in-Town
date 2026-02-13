import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { placeTypes, vehicleTypes } from '../data/mockData';
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

function createEmojiIcon(emoji, bgColor) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${bgColor};width:24px;height:24px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:12px;">${emoji}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

const filters = ['all', 'people', 'places', 'vehicles', 'gear', 'events'];

export default function MapView() {
  const {
    user, allUsers, allPlaces, allVehicles, allGear, allEvents,
    startDirectMessage, getUserById,
    getUserCurrentLocation, getLocationById, getItemLocation,
  } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [selectedPlaceType, setSelectedPlaceType] = useState('all');

  const currentUserLoc = getUserCurrentLocation(user.id);
  const center = currentUserLoc ? [currentUserLoc.lat, currentUserLoc.lng] : [34.05, -118.25];

  const otherUsers = allUsers.filter((u) => u.id !== user.id);

  const handleMessage = (userId) => {
    const threadId = startDirectMessage(userId);
    if (threadId) {
      navigate('/messages', { state: { openThread: threadId } });
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleMessageOwner = (ownerId) => {
    const threadId = startDirectMessage(ownerId);
    if (threadId) {
      navigate('/messages', { state: { openThread: threadId } });
    }
  };

  return (
    <div className="pb-24 pt-[76px]">
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
            {currentUserLoc && (
              <Marker
                position={[currentUserLoc.lat, currentUserLoc.lng]}
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
                    <span className="text-xs">{currentUserLoc.city}, {currentUserLoc.state}</span>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* 10-mile radius circle */}
            {currentUserLoc && (
              <Circle
                center={center}
                radius={16093}
                pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.05, weight: 1, dashArray: '5,5' }}
              />
            )}

            {/* Other users */}
            {(filter === 'all' || filter === 'people') &&
              otherUsers.map((u) => {
                const loc = getUserCurrentLocation(u.id);
                if (!loc) return null;
                return (
                  <Marker
                    key={u.id}
                    position={[loc.lat, loc.lng]}
                    icon={createPersonIcon(u.name)}
                  >
                    <Popup>
                      <div className="text-center min-w-[160px]">
                        <strong>{u.name}</strong>
                        <br />
                        <span className="text-xs text-gray-500">{loc.city}</span>
                        <br />
                        <span className="text-xs">{u.distance} mi away</span>
                        <br />
                        <div className="flex flex-wrap gap-1 mt-1 justify-center">
                          {u.interests.slice(0, 3).map((i) => (
                            <span key={i} className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">{i}</span>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-2 justify-center">
                          <button
                            onClick={() => handleMessage(u.id)}
                            className="text-[11px] font-medium bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Message
                          </button>
                          <button
                            onClick={() => handleViewProfile(u.id)}
                            className="text-[11px] font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-lg hover:bg-slate-200 transition-colors"
                          >
                            Profile
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            {/* Places */}
            {(filter === 'all' || filter === 'places') &&
              allPlaces
                .filter((p) => selectedPlaceType === 'all' || p.type === selectedPlaceType)
                .map((place) => {
                  const loc = getLocationById(place.locationId);
                  if (!loc) return null;
                  const owner = getUserById(place.addedBy);
                  const inUseUser = place.inUseBy ? getUserById(place.inUseBy) : null;
                  return (
                    <Marker
                      key={place.id}
                      position={[loc.lat, loc.lng]}
                      icon={createColorIcon(placeTypes[place.type]?.color || '#64748b')}
                    >
                      <Popup>
                        <div className="min-w-[160px]">
                          <strong>{place.name}</strong>
                          <br />
                          <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded-full">{placeTypes[place.type]?.label}</span>
                          {place.cost && <span className="text-xs ml-1">&middot; {place.cost}</span>}
                          <br />
                          <span className="text-xs text-gray-500">{place.description}</span>
                          {loc.address && (
                            <>
                              <br />
                              <span className="text-[10px] text-gray-400">{loc.address}</span>
                            </>
                          )}
                          {inUseUser && (
                            <>
                              <br />
                              <span className="text-[10px] font-medium text-blue-600">In use by {inUseUser.name}</span>
                            </>
                          )}
                          {place.googleLink && (
                            <>
                              <br />
                              <a href={place.googleLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 underline">View on Google Maps</a>
                            </>
                          )}
                          {owner && owner.id !== user.id && (
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleMessageOwner(owner.id)}
                                className="text-[11px] font-medium bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors"
                              >
                                Message {owner.name}
                              </button>
                            </div>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}

            {/* Vehicles */}
            {(filter === 'all' || filter === 'vehicles') &&
              allVehicles.map((v) => {
                const loc = getItemLocation(v);
                if (!loc) return null;
                const owner = getUserById(v.owner);
                const borrower = v.borrowedBy ? getUserById(v.borrowedBy) : null;
                const vType = vehicleTypes[v.type] || {};
                return (
                  <Marker
                    key={v.id}
                    position={[loc.lat, loc.lng]}
                    icon={createEmojiIcon(v.type === 'bike' ? '\u{1F6B2}' : v.type === 'van' ? '\u{1F690}' : v.type === 'truck' ? '\u{1F69A}' : v.type === 'scooter' ? '\u{1F6F4}' : '\u{1F697}', vType.color || '#3b82f6')}
                  >
                    <Popup>
                      <div className="min-w-[160px]">
                        <strong>{v.name}</strong>
                        <br />
                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: (vType.color || '#64748b') + '20', color: vType.color || '#64748b' }}>
                          {vType.label || v.type}
                        </span>
                        <span className="text-xs ml-1">&middot; {v.cost}</span>
                        <br />
                        <span className={`text-[10px] font-medium ${v.available ? 'text-emerald-600' : 'text-red-500'}`}>
                          {v.available ? 'Available' : 'Not Available'}
                        </span>
                        {borrower && (
                          <>
                            <br />
                            <span className="text-[10px] font-medium text-blue-600">Borrowed by {borrower.name}</span>
                          </>
                        )}
                        <br />
                        <span className="text-xs text-gray-500">{v.description}</span>
                        {loc.address && (
                          <>
                            <br />
                            <span className="text-[10px] text-gray-400">{loc.address}</span>
                          </>
                        )}
                        {owner && owner.id !== user.id && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleMessageOwner(owner.id)}
                              className="text-[11px] font-medium bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              Message {owner.name}
                            </button>
                            <button
                              onClick={() => handleViewProfile(owner.id)}
                              className="text-[11px] font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                              Profile
                            </button>
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            {/* Gear */}
            {(filter === 'all' || filter === 'gear') &&
              allGear.map((g) => {
                const loc = getItemLocation(g);
                if (!loc) return null;
                const owner = getUserById(g.owner);
                const borrower = g.borrowedBy ? getUserById(g.borrowedBy) : null;
                return (
                  <Marker
                    key={g.id}
                    position={[loc.lat, loc.lng]}
                    icon={createEmojiIcon('\u{1F392}', '#f97316')}
                  >
                    <Popup>
                      <div className="min-w-[160px]">
                        <strong>{g.name}</strong>
                        <br />
                        <span className="text-xs">{g.cost}</span>
                        <span className={`text-[10px] ml-2 font-medium ${g.available ? 'text-emerald-600' : 'text-red-500'}`}>
                          {g.available ? 'Available' : 'In Use'}
                        </span>
                        {borrower && (
                          <>
                            <br />
                            <span className="text-[10px] font-medium text-blue-600">Borrowed by {borrower.name}</span>
                          </>
                        )}
                        <br />
                        <span className="text-xs text-gray-500">{g.description}</span>
                        {owner && owner.id !== user.id && (
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleMessageOwner(owner.id)}
                              className="text-[11px] font-medium bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              Message {owner.name}
                            </button>
                            <button
                              onClick={() => handleViewProfile(owner.id)}
                              className="text-[11px] font-medium bg-slate-100 text-slate-700 px-3 py-1 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                              Profile
                            </button>
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            {/* Events */}
            {(filter === 'all' || filter === 'events') &&
              allEvents.map((event) => {
                const loc = getLocationById(event.locationId);
                if (!loc) return null;
                return (
                  <Marker
                    key={event.id}
                    position={[loc.lat, loc.lng]}
                    icon={createColorIcon('#f59e0b')}
                  >
                    <Popup>
                      <div className="min-w-[140px]">
                        <strong>{event.name}</strong>
                        <br />
                        <span className="text-xs">{event.date} at {event.time}</span>
                        <br />
                        <span className="text-xs text-gray-500">{loc.name}</span>
                        <br />
                        <span className="text-xs">{event.attendees} attending</span>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
