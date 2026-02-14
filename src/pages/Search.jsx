import { useState, useMemo, useEffect } from 'react';
import {
  Search as SearchIcon, Users, MapPin, Package, Calendar, Car, MessageCircle,
  Trees, Laptop, Moon, Droplets, Leaf, Tent, Star, UtensilsCrossed, Store,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { placeTypes, vehicleTypes } from '../data/mockData';
import Avatar from '../components/Avatar';

const tabs = [
  { id: 'people', label: 'People', icon: Users },
  { id: 'places', label: 'Places', icon: MapPin },
  { id: 'vehicles', label: 'Vehicles', icon: Car },
  { id: 'gear', label: 'Gear', icon: Package },
  { id: 'events', label: 'Events', icon: Calendar },
];

const activityFilters = [
  { label: 'Exercise with', interests: ['hiking', 'running', 'climbing', 'yoga', 'fitness', 'surfing', 'dance'] },
  { label: 'Activity with', interests: ['surfing', 'camping', 'climbing', 'music', 'photography', 'board games'] },
  { label: 'Spend time with', interests: ['cooking', 'art', 'gardening', 'food', 'meditation'] },
  { label: 'Explore with', interests: ['hiking', 'foraging', 'travel', 'van life', 'camping'] },
  { label: 'Co-work with', interests: ['co-working', 'tech', 'writing'] },
];

const placeTypeIcons = {
  park: Trees, work: Laptop, sleep: Moon, shower: Droplets,
  kitchen: UtensilsCrossed, foraging: Leaf, 'stealth-camping': Tent,
  recommendation: Star, store: Store, restaurant: UtensilsCrossed, event: Calendar,
};

export default function Search() {
  const {
    allUsers, user, allPlaces, allGear, allVehicles, allEvents,
    getUserById, startDirectMessage, getUserCurrentLocation, getLocationById, rsvpEvent,
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('people');
  const [query, setQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Handle navigation state from Dashboard
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);
  const [selectedPlaceType, setSelectedPlaceType] = useState('all');
  const [maxDistance, setMaxDistance] = useState(50);
  const [rsvpd, setRsvpd] = useState(new Set());

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

  const filteredPeople = useMemo(() => {
    let result = otherUsers;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((u) => {
        const loc = getUserCurrentLocation(u.id);
        return (
          u.name.toLowerCase().includes(q) ||
          u.interests.some((i) => i.toLowerCase().includes(q)) ||
          (loc?.city || '').toLowerCase().includes(q)
        );
      });
    }
    if (selectedActivity) {
      const activityDef = activityFilters.find((a) => a.label === selectedActivity);
      if (activityDef) {
        result = result.filter((u) =>
          u.interests.some((i) => activityDef.interests.includes(i.toLowerCase()))
        );
      }
    }
    result = result.filter((u) => (u.distance || 0) <= maxDistance);
    result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    return result;
  }, [otherUsers, query, maxDistance, selectedActivity, getUserCurrentLocation]);

  const filteredPlaces = useMemo(() => {
    let result = allPlaces;
    if (selectedPlaceType !== 'all') result = result.filter((p) => p.type === selectedPlaceType);
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return result;
  }, [allPlaces, selectedPlaceType, query]);

  const filteredVehicles = useMemo(() => {
    let result = allVehicles;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((v) => v.name.toLowerCase().includes(q) || v.description.toLowerCase().includes(q));
    }
    return result;
  }, [allVehicles, query]);

  const filteredGear = useMemo(() => {
    let result = allGear;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
    }
    return result;
  }, [allGear, query]);

  const filteredEvents = useMemo(() => {
    let result = allEvents.filter((e) => new Date(e.date) >= new Date());
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((e) => {
        const loc = getLocationById(e.locationId);
        return e.name.toLowerCase().includes(q) || (loc?.name || '').toLowerCase().includes(q);
      });
    }
    return result;
  }, [allEvents, query, getLocationById]);

  return (
    <div className="pb-28 pt-16">
      <div className="px-5 py-5 space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, places, vehicles, gear, events..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === id ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* People */}
        {activeTab === 'people' && (
          <div className="space-y-3">
            {/* Activity Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {activityFilters.map((a) => (
                <button
                  key={a.label}
                  onClick={() => setSelectedActivity(selectedActivity === a.label ? null : a.label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedActivity === a.label ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>

            {/* Distance Slider */}
            <div className="bg-white rounded-xl p-3 border border-slate-100">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Max distance</span>
                <span className="font-medium text-emerald-600">{maxDistance} miles</span>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            {filteredPeople.map((person) => {
              const personLoc = getUserCurrentLocation(person.id);
              return (
                <div key={person.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-start gap-3">
                    <Avatar name={person.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-slate-800">{person.name}</h3>
                        <span className="text-xs text-slate-400">{person.distance} mi</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {personLoc ? `${personLoc.city}, ${personLoc.state}` : 'Location unknown'}
                      </p>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{person.bio}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {person.interests.map((i) => (
                          <span key={i} className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{i}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-medium text-slate-600">{person.reputation}</span>
                        <span className="text-xs text-slate-400">({person.totalRatings} ratings)</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleMessage(person.id)}
                          className="flex items-center gap-1.5 text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                          <MessageCircle size={14} /> Message
                        </button>
                        <button
                          onClick={() => handleViewProfile(person.id)}
                          className="text-sm font-medium bg-slate-100 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredPeople.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-8">No people found matching your search</p>
            )}
          </div>
        )}

        {/* Places */}
        {activeTab === 'places' && (
          <div className="space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedPlaceType('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  selectedPlaceType === 'all' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                All
              </button>
              {Object.entries(placeTypes).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPlaceType(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                    selectedPlaceType === key ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {filteredPlaces.map((place) => {
              const typeInfo = placeTypes[place.type] || {};
              const PlaceIcon = placeTypeIcons[place.type] || MapPin;
              const owner = getUserById(place.addedBy);
              const loc = getLocationById(place.locationId);
              return (
                <div key={place.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: (typeInfo.color || '#64748b') + '20' }}
                    >
                      <PlaceIcon size={18} style={{ color: typeInfo.color || '#64748b' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm text-slate-800">{place.name}</h3>
                        {place.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            <span className="text-xs font-medium text-slate-600">{place.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: (typeInfo.color || '#64748b') + '20', color: typeInfo.color || '#64748b' }}>
                          {typeInfo.label}
                        </span>
                        {place.cost && <span className="text-xs text-slate-400">{place.cost}</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{place.description}</p>
                      {loc?.address && <p className="text-[10px] text-slate-400 mt-1">{loc.address}</p>}
                      {place.googleLink && (
                        <a href={place.googleLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 underline">Google Maps</a>
                      )}
                      {owner && owner.id !== user.id && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleMessage(owner.id)} className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 hover:underline">
                            <MessageCircle size={10} /> Message {owner.name}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredPlaces.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-8">No places found</p>
            )}
          </div>
        )}

        {/* Vehicles */}
        {activeTab === 'vehicles' && (
          <div className="space-y-3">
            {filteredVehicles.map((v) => {
              const owner = getUserById(v.owner);
              const vType = vehicleTypes[v.type] || {};
              return (
                <div key={v.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-slate-800">{v.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Owned by {owner?.name || 'Unknown'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: (vType.color || '#64748b') + '20', color: vType.color || '#64748b' }}>
                          {vType.label || v.type}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${v.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                          {v.available ? 'Available' : 'Not Available'}
                        </span>
                        <span className="text-xs text-slate-400">{v.cost}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{v.description}</p>
                      {owner && owner.id !== user.id && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleMessage(owner.id)} className="flex items-center gap-1 text-xs font-medium bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
                            <MessageCircle size={12} /> Message {owner.name}
                          </button>
                          <button onClick={() => handleViewProfile(owner.id)} className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                            Profile
                          </button>
                        </div>
                      )}
                    </div>
                    <Car size={20} className="text-slate-300 shrink-0" />
                  </div>
                </div>
              );
            })}
            {filteredVehicles.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-8">No vehicles found</p>
            )}
          </div>
        )}

        {/* Gear */}
        {activeTab === 'gear' && (
          <div className="space-y-3">
            {filteredGear.map((item) => {
              const owner = getUserById(item.owner);
              return (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-slate-800">{item.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Owned by {owner?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                          {item.available ? 'Available' : 'In Use'}
                        </span>
                        <span className="text-xs text-slate-400">{item.cost}</span>
                      </div>
                      {owner && owner.id !== user.id && (
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleMessage(owner.id)} className="flex items-center gap-1 text-xs font-medium bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
                            <MessageCircle size={12} /> Message {owner.name}
                          </button>
                          <button onClick={() => handleViewProfile(owner.id)} className="text-xs font-medium bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                            Profile
                          </button>
                        </div>
                      )}
                    </div>
                    <Package size={20} className="text-slate-300 shrink-0" />
                  </div>
                </div>
              );
            })}
            {filteredGear.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-8">No gear found</p>
            )}
          </div>
        )}

        {/* Events */}
        {activeTab === 'events' && (
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const host = getUserById(event.host);
              const eventLoc = getLocationById(event.locationId);
              return (
                <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-14 rounded-xl bg-blue-50 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-blue-600">{new Date(event.date).toLocaleDateString('en', { month: 'short' })}</span>
                      <span className="text-xl font-bold text-blue-700 leading-none">{new Date(event.date).getDate()}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800">{event.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{event.time} &middot; {eventLoc?.name || 'Unknown location'}</p>
                      <p className="text-xs text-slate-400">Hosted by {host?.name || 'Unknown'}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-emerald-600 font-medium">{event.attendees} attending</span>
                        <button
                          onClick={() => { rsvpEvent(event.id); setRsvpd((prev) => new Set(prev).add(event.id)); }}
                          disabled={rsvpd.has(event.id)}
                          className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors ${
                            rsvpd.has(event.id)
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {rsvpd.has(event.id) ? 'Going!' : 'RSVP'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredEvents.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-8">No upcoming events</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
