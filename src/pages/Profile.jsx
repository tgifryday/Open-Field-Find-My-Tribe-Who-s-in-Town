import { useState } from 'react';
import { MapPin, Star, Calendar, Users, LogOut, ChevronRight, Navigation, Edit3, Plus, X, Home, Car, Package, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { placeTypes, vehicleTypes } from '../data/mockData';
import Avatar from '../components/Avatar';

export default function Profile() {
  const { user, logout, getUserTribes, getUserPlaces, getUserVehicles, getUserGear, addPlace, addVehicle, addGear } = useApp();
  const [activeSection, setActiveSection] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(null); // 'place', 'vehicle', 'gear', 'recommendation'
  const userTribes = getUserTribes();
  const userPlaces = getUserPlaces(user.id);
  const userVehicles = getUserVehicles(user.id);
  const userGear = getUserGear(user.id);

  // Form states
  const [formData, setFormData] = useState({});

  const resetForm = () => {
    setFormData({});
    setShowCreateModal(null);
  };

  const handleCreatePlace = () => {
    if (!formData.name || !formData.lat || !formData.lng) return;
    addPlace({
      name: formData.name,
      type: formData.type || 'room',
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      description: formData.description || '',
      cost: formData.cost || '',
      address: formData.address || '',
      googleLink: formData.googleLink || '',
    });
    resetForm();
  };

  const handleCreateVehicle = () => {
    if (!formData.name || !formData.lat || !formData.lng) return;
    addVehicle({
      name: formData.name,
      type: formData.type || 'car',
      available: formData.available !== 'false',
      cost: formData.cost || 'free',
      description: formData.description || '',
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      address: formData.address || '',
    });
    resetForm();
  };

  const handleCreateGear = () => {
    if (!formData.name) return;
    addGear({
      name: formData.name,
      available: formData.available !== 'false',
      cost: formData.cost || 'free',
      description: formData.description || '',
      lat: formData.lat ? parseFloat(formData.lat) : user.location.lat,
      lng: formData.lng ? parseFloat(formData.lng) : user.location.lng,
    });
    resetForm();
  };

  const handleCreateRecommendation = () => {
    if (!formData.name || !formData.lat || !formData.lng) return;
    addPlace({
      name: formData.name,
      type: formData.type || 'restaurant',
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      description: formData.description || '',
      googleLink: formData.googleLink || '',
    });
    resetForm();
  };

  const useMyLocation = () => {
    setFormData((prev) => ({
      ...prev,
      lat: String(user.location.lat),
      lng: String(user.location.lng),
    }));
  };

  const placeTypeOptions = ['room', 'garage', 'yard', 'session-space', 'work', 'sleep', 'shower', 'kitchen', 'park', 'foraging', 'stealth-camping'];
  const recommendationTypes = ['restaurant', 'cafe', 'recommendation', 'store'];

  return (
    <div className="pb-20 pt-16">
      <div className="px-4 py-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
          <Avatar name={user.name} size="xl" className="mx-auto" />
          <h2 className="text-xl font-bold text-slate-800 mt-3">{user.name === 'You' ? 'Explorer' : user.name}</h2>
          <div className="flex items-center justify-center gap-1 text-slate-400 text-sm mt-1">
            <MapPin size={14} />
            <span>{user.location.city}, {user.location.state}</span>
          </div>
          <p className="text-sm text-slate-600 mt-3">{user.bio}</p>

          {/* Stats */}
          <div className="flex gap-4 justify-center mt-4">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span className="text-lg font-bold text-slate-800">{user.reputation}</span>
              </div>
              <p className="text-xs text-slate-400">{user.totalRatings} ratings</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">{userTribes.length}</p>
              <p className="text-xs text-slate-400">Tribes</p>
            </div>
          </div>

          <button className="mt-4 flex items-center gap-2 mx-auto text-sm text-emerald-600 font-medium bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors">
            <Edit3 size={14} /> Edit Profile
          </button>
        </div>

        {/* Interests */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-sm text-slate-700 mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <span key={interest} className="text-sm bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* My Listings */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
              <Home size={14} className="text-purple-500" /> My Listings
            </h3>
          </div>

          {/* Create Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setShowCreateModal('place')}
              className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-emerald-300 text-emerald-600 text-xs font-medium hover:bg-emerald-50 transition-colors"
            >
              <Plus size={14} /> Add Place
            </button>
            <button
              onClick={() => setShowCreateModal('vehicle')}
              className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-blue-300 text-blue-600 text-xs font-medium hover:bg-blue-50 transition-colors"
            >
              <Plus size={14} /> Add Vehicle
            </button>
            <button
              onClick={() => setShowCreateModal('gear')}
              className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-orange-300 text-orange-600 text-xs font-medium hover:bg-orange-50 transition-colors"
            >
              <Plus size={14} /> Add Gear
            </button>
            <button
              onClick={() => setShowCreateModal('recommendation')}
              className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-amber-300 text-amber-600 text-xs font-medium hover:bg-amber-50 transition-colors"
            >
              <Plus size={14} /> Add Recommendation
            </button>
          </div>

          {/* Listing Summaries */}
          <div className="space-y-2">
            {userPlaces.length > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Home size={16} className="text-purple-500" />
                <span className="text-sm text-slate-700 flex-1">{userPlaces.length} place{userPlaces.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            {userVehicles.length > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Car size={16} className="text-blue-500" />
                <span className="text-sm text-slate-700 flex-1">{userVehicles.length} vehicle{userVehicles.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            {userGear.length > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Package size={16} className="text-orange-500" />
                <span className="text-sm text-slate-700 flex-1">{userGear.length} gear item{userGear.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            {userPlaces.length === 0 && userVehicles.length === 0 && userGear.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-2">No listings yet. Add your first one above!</p>
            )}
          </div>
        </div>

        {/* Future Locations */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-sm text-slate-700 mb-3 flex items-center gap-2">
            <Navigation size={14} className="text-blue-500" /> Future Locations
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Let your tribes know where you'll be so people can find you or plan meetups.
          </p>
          <div className="space-y-2">
            {user.futureLocations.map((loc, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-blue-600">
                    {new Date(loc.date).toLocaleDateString('en', { month: 'short' })}
                  </span>
                  <span className="text-sm font-bold text-blue-700 leading-none">
                    {new Date(loc.date).getDate()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-700">{loc.city}, {loc.state}</p>
                  <p className="text-xs text-slate-400">{new Date(loc.date).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            ))}
            <button className="w-full py-2 text-sm text-emerald-600 font-medium rounded-xl border border-dashed border-emerald-300 hover:bg-emerald-50 transition-colors">
              + Add Future Location
            </button>
          </div>
        </div>

        {/* Reputation */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-sm text-slate-700 mb-3 flex items-center gap-2">
            <Star size={14} className="text-amber-400" /> Reputation
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Your reputation is based on private ratings from people you've interacted with. Only your average score is visible to others.
          </p>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={20}
                  className={s <= Math.round(user.reputation) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                />
              ))}
            </div>
            <div>
              <p className="font-bold text-lg text-slate-800">{user.reputation}</p>
              <p className="text-xs text-slate-500">{user.totalRatings} total ratings</p>
            </div>
          </div>
        </div>

        {/* My Tribes */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-sm text-slate-700 mb-3 flex items-center gap-2">
            <Users size={14} className="text-purple-500" /> My Tribes
          </h3>
          <div className="space-y-2">
            {userTribes.map((tribe) => (
              <div key={tribe.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: tribe.color + '20' }}>
                  <Users size={14} style={{ color: tribe.color }} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-slate-700">{tribe.name}</p>
                  <p className="text-xs text-slate-400">{tribe.memberCount} members</p>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Settings / Logout */}
        <div className="space-y-2">
          <button className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <span className="text-sm font-medium text-slate-700">Settings & Privacy</span>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
          <button className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <span className="text-sm font-medium text-slate-700">Subscription</span>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Create Place Modal */}
      {showCreateModal === 'place' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">Add a Place</h3>
              <button onClick={resetForm} className="p-1 rounded-lg hover:bg-slate-100"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Name *" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <select value={formData.type || 'room'} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                {placeTypeOptions.map((t) => (
                  <option key={t} value={t}>{placeTypes[t]?.label || t}</option>
                ))}
              </select>
              <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" rows={2} />
              <input type="text" placeholder="Cost (e.g. $30/night, free)" value={formData.cost || ''} onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input type="text" placeholder="Address" value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <div className="flex gap-2">
                <input type="text" placeholder="Latitude *" value={formData.lat || ''} onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input type="text" placeholder="Longitude *" value={formData.lng || ''} onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <button onClick={useMyLocation} className="text-xs text-emerald-600 font-medium hover:underline">
                Use my current location
              </button>
              <button onClick={handleCreatePlace} disabled={!formData.name || !formData.lat || !formData.lng}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50">
                Add Place
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Vehicle Modal */}
      {showCreateModal === 'vehicle' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">Add a Vehicle</h3>
              <button onClick={resetForm} className="p-1 rounded-lg hover:bg-slate-100"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Name (e.g. Honda Civic 2020) *" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <select value={formData.type || 'car'} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {Object.entries(vehicleTypes).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
              <input type="text" placeholder="Cost (e.g. $30/day, free)" value={formData.cost || ''} onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <select value={formData.available || 'true'} onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="true">Available for rent/borrow</option>
                <option value="false">Not available right now</option>
              </select>
              <input type="text" placeholder="Address / Pickup location" value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="flex gap-2">
                <input type="text" placeholder="Latitude *" value={formData.lat || ''} onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Longitude *" value={formData.lng || ''} onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button onClick={useMyLocation} className="text-xs text-blue-600 font-medium hover:underline">
                Use my current location
              </button>
              <button onClick={handleCreateVehicle} disabled={!formData.name || !formData.lat || !formData.lng}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50">
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Gear Modal */}
      {showCreateModal === 'gear' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">Add Gear</h3>
              <button onClick={resetForm} className="p-1 rounded-lg hover:bg-slate-100"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <input type="text" placeholder="Name (e.g. Camping Tent) *" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" rows={2} />
              <input type="text" placeholder="Cost (e.g. $10/day, free)" value={formData.cost || ''} onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <select value={formData.available || 'true'} onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                <option value="true">Available for rent/borrow</option>
                <option value="false">Not available right now</option>
              </select>
              <p className="text-xs text-slate-400">Location defaults to your current location.</p>
              <button onClick={handleCreateGear} disabled={!formData.name}
                className="w-full py-3 rounded-xl bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition-colors disabled:opacity-50">
                Add Gear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Recommendation Modal */}
      {showCreateModal === 'recommendation' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">Add a Recommendation</h3>
              <button onClick={resetForm} className="p-1 rounded-lg hover:bg-slate-100"><X size={20} /></button>
            </div>
            <p className="text-xs text-slate-500">Recommend a restaurant, cafe, or other place you love. Paste a Google Maps link for easy location sharing.</p>
            <div className="space-y-3">
              <input type="text" placeholder="Name *" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <select value={formData.type || 'restaurant'} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                {recommendationTypes.map((t) => (
                  <option key={t} value={t}>{placeTypes[t]?.label || t}</option>
                ))}
              </select>
              <textarea placeholder="Why do you recommend it?" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" rows={2} />
              <input type="text" placeholder="Google Maps link" value={formData.googleLink || ''} onChange={(e) => setFormData({ ...formData, googleLink: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <div className="flex gap-2">
                <input type="text" placeholder="Latitude *" value={formData.lat || ''} onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                <input type="text" placeholder="Longitude *" value={formData.lng || ''} onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <button onClick={useMyLocation} className="text-xs text-amber-600 font-medium hover:underline">
                Use my current location
              </button>
              <button onClick={handleCreateRecommendation} disabled={!formData.name || !formData.lat || !formData.lng}
                className="w-full py-3 rounded-xl bg-amber-500 text-white font-medium text-sm hover:bg-amber-600 transition-colors disabled:opacity-50">
                Add Recommendation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
