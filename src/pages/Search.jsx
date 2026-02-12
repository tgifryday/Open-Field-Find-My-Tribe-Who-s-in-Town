import { useState, useMemo } from 'react';
import {
  Search as SearchIcon, Users, MapPin, Package, Calendar,
  Trees, Laptop, Moon, Droplets, Leaf, Tent, Star, UtensilsCrossed, Store,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { placeTypes } from '../data/mockData';
import Avatar from '../components/Avatar';

const tabs = [
  { id: 'people', label: 'People', icon: Users },
  { id: 'places', label: 'Places', icon: MapPin },
  { id: 'gear', label: 'Gear', icon: Package },
  { id: 'events', label: 'Events', icon: Calendar },
];

const activityFilters = [
  'Exercise with', 'Activity with', 'Spend time with', 'Explore with', 'Co-work with',
];

const placeTypeIcons = {
  park: Trees, work: Laptop, sleep: Moon, shower: Droplets,
  kitchen: UtensilsCrossed, foraging: Leaf, 'stealth-camping': Tent,
  recommendation: Star, store: Store, restaurant: UtensilsCrossed, event: Calendar,
};

export default function Search() {
  const { allUsers, user, allPlaces, allGear, allEvents, getUserById } = useApp();
  const [activeTab, setActiveTab] = useState('people');
  const [query, setQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedPlaceType, setSelectedPlaceType] = useState('all');
  const [maxDistance, setMaxDistance] = useState(50);

  const otherUsers = allUsers.filter((u) => u.id !== user.id);

  const filteredPeople = useMemo(() => {
    let result = otherUsers;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.interests.some((i) => i.toLowerCase().includes(q)) ||
          u.location.city.toLowerCase().includes(q)
      );
    }
    result = result.filter((u) => (u.distance || 0) <= maxDistance);
    result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    return result;
  }, [otherUsers, query, maxDistance]);

  const filteredPlaces = useMemo(() => {
    let result = allPlaces;
    if (selectedPlaceType !== 'all') result = result.filter((p) => p.type === selectedPlaceType);
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return result;
  }, [allPlaces, selectedPlaceType, query]);

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
      result = result.filter((e) => e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
    }
    return result;
  }, [allEvents, query]);

  return (
    <div className="pb-20 pt-16">
      <div className="px-4 py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, places, gear, events..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
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
                  key={a}
                  onClick={() => setSelectedActivity(selectedActivity === a ? null : a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedActivity === a ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {a}
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

            {filteredPeople.map((person) => (
              <div key={person.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-start gap-3">
                  <Avatar name={person.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-800">{person.name}</h3>
                      <span className="text-xs text-slate-400">{person.distance} mi</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{person.location.city}, {person.location.state}</p>
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
                  </div>
                </div>
              </div>
            ))}
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
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs font-medium text-slate-600">{place.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: (typeInfo.color || '#64748b') + '20', color: typeInfo.color || '#64748b' }}>
                          {typeInfo.label}
                        </span>
                        {place.cost && <span className="text-xs text-slate-400">{place.cost}</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{place.description}</p>
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

        {/* Gear */}
        {activeTab === 'gear' && (
          <div className="space-y-3">
            {filteredGear.map((item) => {
              const owner = getUserById(item.owner);
              return (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-sm text-slate-800">{item.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Owned by {owner?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                          {item.available ? 'Available' : 'In Use'}
                        </span>
                        <span className="text-xs text-slate-400">{item.cost}</span>
                      </div>
                    </div>
                    <Package size={20} className="text-slate-300" />
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
              return (
                <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-14 rounded-xl bg-blue-50 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-blue-600">{new Date(event.date).toLocaleDateString('en', { month: 'short' })}</span>
                      <span className="text-xl font-bold text-blue-700 leading-none">{new Date(event.date).getDate()}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800">{event.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{event.time} &middot; {event.location}</p>
                      <p className="text-xs text-slate-400">Hosted by {host?.name || 'Unknown'}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-emerald-600 font-medium">{event.attendees} attending</span>
                        <button className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg hover:bg-emerald-100 transition-colors">
                          RSVP
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
