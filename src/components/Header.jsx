import { Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export default function Header() {
  const { notifications, markNotificationRead } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-lg mx-auto flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <h1 className="text-lg font-bold text-emerald-700">Open Field</h1>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <Bell size={20} className="text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
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
                      onClick={() => { markNotificationRead(n.id); }}
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
          )}
        </div>
      </div>
    </header>
  );
}
