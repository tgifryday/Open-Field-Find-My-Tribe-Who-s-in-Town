import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export default function Header() {
  const { notifications, markNotificationRead } = useApp();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (n) => {
    markNotificationRead(n.id);
    setShowNotifs(false);
    if (n.type === 'callout') {
      navigate('/callouts', { state: n.calloutId ? { openCallout: n.calloutId } : undefined });
    } else if (n.type === 'event') {
      navigate('/search', { state: { tab: 'events' } });
    } else if (n.type === 'message') {
      navigate('/messages');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-50">
      <div className="max-w-lg mx-auto flex items-center justify-between h-12 px-5">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <span className="text-lg">🌿</span>
          <h1 className="text-base font-bold text-emerald-700 tracking-tight">Open Field</h1>
        </button>
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2.5 rounded-full hover:bg-slate-100/80 transition-colors"
          >
            <Bell size={18} className="text-slate-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="p-3 border-b border-slate-100">
                  <h3 className="font-semibold text-sm text-slate-700">Notifications</h3>
                </div>
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm text-slate-400 text-center">No notifications</p>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`w-full text-left p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                          !n.read ? 'bg-emerald-50/50' : ''
                        }`}
                      >
                        <p className="text-sm text-slate-700">{n.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
