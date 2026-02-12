import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Calendar, Megaphone, Users, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';

export default function Dashboard() {
  const { user, getNearbyUsers, getUserTribes, allCallouts, allEvents } = useApp();
  const nearbyUsers = getNearbyUsers(20);
  const userTribes = getUserTribes();
  const incomingCallouts = allCallouts.filter((c) => c.senderId !== user.id);
  const upcomingEvents = allEvents.filter((e) => new Date(e.date) >= new Date()).slice(0, 3);

  return (
    <div className="pb-20 pt-16">
      <div className="px-4 py-4 space-y-5">
        {/* Welcome */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white">
          <p className="text-emerald-100 text-sm">Welcome back,</p>
          <h2 className="text-xl font-bold mb-1">{user.name === 'You' ? 'Explorer' : user.name}</h2>
          <div className="flex items-center gap-1 text-emerald-100 text-sm">
            <MapPin size={14} />
            <span>{user.location.city}, {user.location.state}</span>
          </div>
          <div className="flex gap-3 mt-4">
            <div className="bg-white/20 rounded-xl px-3 py-2 text-center flex-1">
              <p className="text-lg font-bold">{nearbyUsers.length}</p>
              <p className="text-xs text-emerald-100">Nearby</p>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-2 text-center flex-1">
              <p className="text-lg font-bold">{userTribes.length}</p>
              <p className="text-xs text-emerald-100">Tribes</p>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-2 text-center flex-1">
              <p className="text-lg font-bold">{incomingCallouts.length}</p>
              <p className="text-xs text-emerald-100">Callouts</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { to: '/callouts?new=1', icon: Megaphone, label: "Who's Here?", color: 'bg-amber-100 text-amber-600' },
            { to: '/map', icon: Compass, label: 'Explore', color: 'bg-emerald-100 text-emerald-600' },
            { to: '/search', icon: Users, label: 'Find People', color: 'bg-blue-100 text-blue-600' },
            { to: '/tribes', icon: Users, label: 'My Tribes', color: 'bg-purple-100 text-purple-600' },
          ].map(({ to, icon: Icon, label, color }) => (
            <Link key={to} to={to} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon size={20} />
              </div>
              <span className="text-[11px] font-medium text-slate-600 text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>

        {/* Incoming Callouts */}
        {incomingCallouts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Megaphone size={16} className="text-amber-500" /> Active Callouts
              </h3>
              <Link to="/callouts" className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-2">
              {incomingCallouts.slice(0, 2).map((callout) => (
                <Link
                  key={callout.id}
                  to="/callouts"
                  className="block bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={callout.senderName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-slate-800">{callout.senderName}</span>
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{callout.tribeName}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1 truncate">{callout.message}</p>
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-slate-400">
                        <MapPin size={12} />
                        <span>{callout.location.city}, {callout.location.state}</span>
                        <span className="mx-1">&middot;</span>
                        <span>{callout.responses.length} responses</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* People Nearby */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <MapPin size={16} className="text-emerald-500" /> People Nearby
            </h3>
            <Link to="/search?tab=people" className="text-emerald-600 text-sm font-medium flex items-center gap-1">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {nearbyUsers.slice(0, 6).map((person) => (
              <div key={person.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 min-w-[140px] shrink-0">
                <div className="flex flex-col items-center text-center">
                  <Avatar name={person.name} size="md" />
                  <p className="font-medium text-sm text-slate-800 mt-2 truncate w-full">{person.name}</p>
                  <p className="text-xs text-slate-400">{person.distance} mi away</p>
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {person.interests.slice(0, 2).map((i) => (
                      <span key={i} className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full">{i}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" /> Upcoming Events
            </h3>
            <Link to="/search?tab=events" className="text-emerald-600 text-sm font-medium flex items-center gap-1">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-blue-600">{new Date(event.date).toLocaleDateString('en', { month: 'short' })}</span>
                    <span className="text-lg font-bold text-blue-700 leading-none">{new Date(event.date).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-800">{event.name}</p>
                    <p className="text-xs text-slate-400">{event.time} &middot; {event.location}</p>
                    <p className="text-xs text-slate-400">{event.attendees} attending</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
