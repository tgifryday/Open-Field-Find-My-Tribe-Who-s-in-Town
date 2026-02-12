import { useState } from 'react';
import { MapPin, Star, Calendar, Users, LogOut, ChevronRight, Navigation, Edit3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';

export default function Profile() {
  const { user, logout, getUserTribes } = useApp();
  const [activeSection, setActiveSection] = useState(null);
  const userTribes = getUserTribes();

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
    </div>
  );
}
