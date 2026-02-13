import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Users, ArrowLeft, MessageCircle, Package, Car, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { placeTypes, vehicleTypes } from '../data/mockData';
import Avatar from '../components/Avatar';

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    getUserById, getUserPlaces, getUserVehicles, getUserGear, getUserTribes, allTribes,
    startDirectMessage, user, getUserCurrentLocation, getLocationById, getItemLocation,
  } = useApp();
  const [activeTab, setActiveTab] = useState('about');

  const profileUser = getUserById(userId);
  if (!profileUser) {
    return (
      <div className="pb-24 pt-[76px]">
        <div className="px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <ArrowLeft size={16} /> Back
          </button>
          <p className="text-center text-slate-400 py-12">User not found</p>
        </div>
      </div>
    );
  }

  const userPlaces = getUserPlaces(userId);
  const userVehicles = getUserVehicles(userId);
  const userGear = getUserGear(userId);
  const userTribesArr = allTribes.filter((t) => t.members.includes(userId));
  const profileLoc = getUserCurrentLocation(userId);

  const handleMessage = () => {
    const threadId = startDirectMessage(userId);
    if (threadId) {
      navigate('/messages', { state: { openThread: threadId } });
    }
  };

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'places', label: `Places (${userPlaces.length})` },
    { id: 'vehicles', label: `Vehicles (${userVehicles.length})` },
    { id: 'gear', label: `Gear (${userGear.length})` },
  ];

  return (
    <div className="pb-24 pt-[76px]">
      <div className="px-4 py-4 space-y-5">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-600">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
          <Avatar name={profileUser.name} size="xl" className="mx-auto" />
          <h2 className="text-xl font-bold text-slate-800 mt-3">{profileUser.name}</h2>
          <div className="flex items-center justify-center gap-1 text-slate-400 text-sm mt-1">
            <MapPin size={14} />
            <span>{profileLoc ? `${profileLoc.city}, ${profileLoc.state}` : 'Location unknown'}</span>
          </div>
          <p className="text-sm text-slate-600 mt-3">{profileUser.bio}</p>

          {/* Stats */}
          <div className="flex gap-4 justify-center mt-4">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span className="text-lg font-bold text-slate-800">{profileUser.reputation}</span>
              </div>
              <p className="text-xs text-slate-400">{profileUser.totalRatings} ratings</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">{userTribesArr.length}</p>
              <p className="text-xs text-slate-400">Tribes</p>
            </div>
          </div>

          {/* Message Button */}
          {profileUser.id !== user.id && (
            <button
              onClick={handleMessage}
              className="mt-4 flex items-center gap-2 mx-auto text-sm text-white font-medium bg-emerald-600 px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle size={16} /> Message {profileUser.name}
            </button>
          )}
        </div>

        {/* Interests */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-sm text-slate-700 mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {profileUser.interests.map((interest) => (
              <span key={interest} className="text-sm bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-3">
            {/* Tribes */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-sm text-slate-700 mb-3 flex items-center gap-2">
                <Users size={14} className="text-purple-500" /> Tribes
              </h3>
              <div className="space-y-2">
                {userTribesArr.map((tribe) => (
                  <div key={tribe.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: tribe.color + '20' }}>
                      <Users size={14} style={{ color: tribe.color }} />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-700">{tribe.name}</p>
                      <p className="text-xs text-slate-400">{tribe.memberCount} members</p>
                    </div>
                  </div>
                ))}
                {userTribesArr.length === 0 && <p className="text-sm text-slate-400">No tribes yet</p>}
              </div>
            </div>

            {/* Reputation */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-sm text-slate-700 mb-3 flex items-center gap-2">
                <Star size={14} className="text-amber-400" /> Reputation
              </h3>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={20}
                      className={s <= Math.round(profileUser.reputation) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                    />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-800">{profileUser.reputation}</p>
                  <p className="text-xs text-slate-500">{profileUser.totalRatings} total ratings</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Places Tab */}
        {activeTab === 'places' && (
          <div className="space-y-3">
            {userPlaces.map((place) => {
              const typeInfo = placeTypes[place.type] || {};
              const loc = getLocationById(place.locationId);
              return (
                <div key={place.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: (typeInfo.color || '#64748b') + '20' }}>
                      <Home size={18} style={{ color: typeInfo.color || '#64748b' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-slate-800">{place.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: (typeInfo.color || '#64748b') + '20', color: typeInfo.color || '#64748b' }}>
                        {typeInfo.label}
                      </span>
                      {place.cost && <span className="text-xs text-slate-400 ml-2">{place.cost}</span>}
                      <p className="text-xs text-slate-500 mt-1">{place.description}</p>
                      {loc?.address && <p className="text-[10px] text-slate-400 mt-1">{loc.address}</p>}
                      {place.googleLink && (
                        <a href={place.googleLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 underline">Google Maps</a>
                      )}
                    </div>
                  </div>
                  {profileUser.id !== user.id && (
                    <button
                      onClick={handleMessage}
                      className="mt-3 w-full text-xs font-medium bg-emerald-50 text-emerald-700 py-2 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      Message about this place
                    </button>
                  )}
                </div>
              );
            })}
            {userPlaces.length === 0 && <p className="text-center text-sm text-slate-400 py-8">No places listed</p>}
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="space-y-3">
            {userVehicles.map((v) => {
              const vType = vehicleTypes[v.type] || {};
              const loc = getItemLocation(v);
              return (
                <div key={v.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-sm text-slate-800">{v.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: (vType.color || '#64748b') + '20', color: vType.color || '#64748b' }}>
                          {vType.label || v.type}
                        </span>
                        <span className="text-xs text-slate-400">{v.cost}</span>
                        <span className={`text-[10px] font-medium ${v.available ? 'text-emerald-600' : 'text-red-500'}`}>
                          {v.available ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{v.description}</p>
                      {loc?.address && <p className="text-[10px] text-slate-400 mt-1">{loc.address}</p>}
                    </div>
                    <Car size={20} className="text-slate-300 shrink-0" />
                  </div>
                  {profileUser.id !== user.id && (
                    <button
                      onClick={handleMessage}
                      className="mt-3 w-full text-xs font-medium bg-emerald-50 text-emerald-700 py-2 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      Message about this vehicle
                    </button>
                  )}
                </div>
              );
            })}
            {userVehicles.length === 0 && <p className="text-center text-sm text-slate-400 py-8">No vehicles listed</p>}
          </div>
        )}

        {/* Gear Tab */}
        {activeTab === 'gear' && (
          <div className="space-y-3">
            {userGear.map((item) => {
              const loc = getItemLocation(item);
              return (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-sm text-slate-800">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                          {item.available ? 'Available' : 'In Use'}
                        </span>
                        <span className="text-xs text-slate-400">{item.cost}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                    </div>
                    <Package size={20} className="text-slate-300 shrink-0" />
                  </div>
                  {profileUser.id !== user.id && (
                    <button
                      onClick={handleMessage}
                      className="mt-3 w-full text-xs font-medium bg-emerald-50 text-emerald-700 py-2 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      Message about this gear
                    </button>
                  )}
                </div>
              );
            })}
            {userGear.length === 0 && <p className="text-center text-sm text-slate-400 py-8">No gear listed</p>}
          </div>
        )}
      </div>
    </div>
  );
}
