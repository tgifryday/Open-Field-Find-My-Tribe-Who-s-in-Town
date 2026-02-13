import { useState } from 'react';
import { Megaphone, MapPin, Send, MessageSquare, Clock, ChevronRight, X, Check, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';

export default function Callouts() {
  const { user, allCallouts, addCallout, respondToCallout, getUserTribes, getUserCurrentLocation } = useApp();
  const [tab, setTab] = useState('incoming');
  const [selectedCallout, setSelectedCallout] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [newCallout, setNewCallout] = useState({ tribeId: '', city: '', state: '', message: '' });

  const userTribes = getUserTribes();
  const incoming = allCallouts.filter((c) => c.senderId !== user.id);
  const outgoing = allCallouts.filter((c) => c.senderId === user.id);
  const currentLoc = getUserCurrentLocation(user.id);

  const handleSendCallout = () => {
    if (!newCallout.tribeId || !newCallout.city || !newCallout.message) return;
    const tribe = userTribes.find((t) => t.id === newCallout.tribeId);
    addCallout({
      senderId: user.id,
      senderName: 'You',
      tribeId: newCallout.tribeId,
      tribeName: tribe?.name || 'Unknown',
      location: {
        city: newCallout.city,
        state: newCallout.state,
        lat: currentLoc?.lat || 0,
        lng: currentLoc?.lng || 0,
      },
      message: newCallout.message,
    });
    setNewCallout({ tribeId: '', city: '', state: '', message: '' });
    setShowCreate(false);
    setTab('sent');
  };

  const handleRespond = (calloutId) => {
    respondToCallout(calloutId, {
      userId: user.id,
      userName: 'You',
      message: responseText || "I'm here!",
    });
    setResponseText('');
    setSelectedCallout(null);
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (selectedCallout) {
    const callout = allCallouts.find((c) => c.id === selectedCallout);
    if (!callout) return null;
    const isMine = callout.senderId === user.id;
    const alreadyResponded = callout.responses.some((r) => r.userId === user.id);

    return (
      <div className="pb-24 pt-[76px]">
        <div className="px-4 py-4 space-y-4">
          <button onClick={() => setSelectedCallout(null)} className="text-sm text-emerald-600 font-medium">
            &larr; Back to Callouts
          </button>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start gap-3 mb-4">
              <Avatar name={callout.senderName} size="md" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{callout.senderName}</span>
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{callout.tribeName}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <MapPin size={12} /> {callout.location.city}, {callout.location.state}
                  <span className="mx-1">&middot;</span>
                  <Clock size={12} /> {formatTime(callout.createdAt)}
                </div>
              </div>
            </div>
            <p className="text-slate-700 bg-slate-50 rounded-xl p-4 text-sm">{callout.message}</p>
          </div>

          {/* Responses */}
          <div>
            <h3 className="font-semibold text-slate-700 text-sm mb-3">
              Responses ({callout.responses.length})
            </h3>
            {callout.responses.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No responses yet</p>
            ) : (
              <div className="space-y-2">
                {callout.responses.map((r, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="flex items-start gap-3">
                      <Avatar name={r.userName} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm text-slate-800">{r.userName}</span>
                          <span className="text-xs text-slate-400">{formatTime(r.respondedAt)}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{r.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Respond */}
          {!isMine && !alreadyResponded && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
              <h3 className="font-semibold text-sm text-slate-700">Respond to this callout</h3>
              <input
                type="text"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="I'm here! (optional message)"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleRespond(callout.id)}
                  className="flex-1 bg-emerald-600 text-white font-medium py-2.5 rounded-xl hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Check size={16} /> I'm in the area!
                </button>
                <button
                  onClick={() => setSelectedCallout(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {!isMine && alreadyResponded && (
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <Check size={20} className="text-emerald-600 mx-auto mb-1" />
              <p className="text-sm text-emerald-700 font-medium">You've responded to this callout</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-[76px]">
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Who's in Town?</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus size={16} /> New Callout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('incoming')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === 'incoming' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Incoming ({incoming.length})
          </button>
          <button
            onClick={() => setTab('sent')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === 'sent' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            My Callouts ({outgoing.length})
          </button>
        </div>

        {/* Callout List */}
        <div className="space-y-3">
          {(tab === 'incoming' ? incoming : outgoing).map((callout) => (
            <button
              key={callout.id}
              onClick={() => setSelectedCallout(callout.id)}
              className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <Avatar name={callout.senderName} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{callout.senderName}</span>
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{callout.tribeName}</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-600 mt-1 truncate">{callout.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {callout.location.city}, {callout.location.state}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={12} /> {callout.responses.length} responses</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {formatTime(callout.createdAt)}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
          {(tab === 'incoming' ? incoming : outgoing).length === 0 && (
            <div className="text-center py-12">
              <Megaphone size={40} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">
                {tab === 'incoming' ? 'No incoming callouts' : "You haven't sent any callouts yet"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Callout Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Send a Callout</h3>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Tribe</label>
                <select
                  value={newCallout.tribeId}
                  onChange={(e) => setNewCallout({ ...newCallout, tribeId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">Select a tribe</option>
                  {userTribes.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">City</label>
                  <input
                    type="text"
                    value={newCallout.city}
                    onChange={(e) => setNewCallout({ ...newCallout, city: e.target.value })}
                    placeholder="Los Angeles"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">State</label>
                  <input
                    type="text"
                    value={newCallout.state}
                    onChange={(e) => setNewCallout({ ...newCallout, state: e.target.value })}
                    placeholder="CA"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Message</label>
                <textarea
                  value={newCallout.message}
                  onChange={(e) => setNewCallout({ ...newCallout, message: e.target.value })}
                  placeholder="Hey! Anyone around this weekend? Looking to co-work or grab coffee..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
              <button
                onClick={handleSendCallout}
                disabled={!newCallout.tribeId || !newCallout.city || !newCallout.message}
                className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={16} /> Send Callout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
