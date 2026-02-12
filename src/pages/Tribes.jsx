import { useState } from 'react';
import { Users, Plus, Link as LinkIcon, Lock, Shield, Crown, LogOut, X, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';

export default function Tribes() {
  const { user, getUserTribes, allTribes, getUserById, createTribe } = useApp();
  const [view, setView] = useState('list');
  const [selectedTribe, setSelectedTribe] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newTribe, setNewTribe] = useState({ name: '', description: '', password: '', color: '#10b981' });
  const [copied, setCopied] = useState(false);

  const userTribes = getUserTribes();

  const handleCreateTribe = () => {
    if (!newTribe.name.trim()) return;
    const tribe = createTribe({
      name: newTribe.name,
      description: newTribe.description,
      password: newTribe.password || null,
      color: newTribe.color,
      joinLink: `openfield.app/join/${newTribe.name.toLowerCase().replace(/\s+/g, '-')}`,
    });
    setNewTribe({ name: '', description: '', password: '', color: '#10b981' });
    setShowCreate(false);
    setSelectedTribe(tribe);
    setView('detail');
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (view === 'detail' && selectedTribe) {
    const tribe = allTribes.find((t) => t.id === selectedTribe.id) || selectedTribe;
    const isOwner = tribe.owners.includes(user.id);
    const isAdmin = tribe.admins.includes(user.id);

    return (
      <div className="pb-20 pt-16">
        <div className="px-4 py-4 space-y-4">
          <button onClick={() => { setView('list'); setSelectedTribe(null); }} className="text-sm text-emerald-600 font-medium">
            &larr; Back to Tribes
          </button>

          <div className="rounded-2xl p-5 text-white" style={{ background: `linear-gradient(135deg, ${tribe.color}, ${tribe.color}dd)` }}>
            <h2 className="text-xl font-bold">{tribe.name}</h2>
            <p className="text-white/80 text-sm mt-1">{tribe.description}</p>
            <div className="flex gap-3 mt-4">
              <div className="bg-white/20 rounded-xl px-3 py-2 text-center flex-1">
                <p className="text-lg font-bold">{tribe.memberCount}</p>
                <p className="text-xs text-white/70">Members</p>
              </div>
              <div className="bg-white/20 rounded-xl px-3 py-2 text-center flex-1">
                <p className="text-lg font-bold">{isOwner ? 'Owner' : isAdmin ? 'Admin' : 'Member'}</p>
                <p className="text-xs text-white/70">Your Role</p>
              </div>
            </div>
          </div>

          {/* Join Link */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                <LinkIcon size={14} /> Join Link
              </h3>
              {tribe.password && <Lock size={14} className="text-amber-500" title="Password protected" />}
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-slate-50 px-3 py-2 rounded-lg text-slate-600 overflow-hidden text-ellipsis">{tribe.joinLink}</code>
              <button
                onClick={() => handleCopyLink(tribe.joinLink)}
                className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Members */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-sm text-slate-700 mb-3">Members</h3>
            <div className="space-y-3">
              {tribe.members.map((memberId) => {
                const member = getUserById(memberId);
                if (!member) return null;
                const memberIsOwner = tribe.owners.includes(memberId);
                const memberIsAdmin = tribe.admins.includes(memberId);
                return (
                  <div key={memberId} className="flex items-center gap-3">
                    <Avatar name={member.name} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-800">
                          {member.id === user.id ? 'You' : member.name}
                        </span>
                        {memberIsOwner && (
                          <span className="flex items-center gap-0.5 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                            <Crown size={10} /> Owner
                          </span>
                        )}
                        {memberIsAdmin && !memberIsOwner && (
                          <span className="flex items-center gap-0.5 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                            <Shield size={10} /> Admin
                          </span>
                        )}
                      </div>
                      {member.location && (
                        <p className="text-xs text-slate-400">{member.location.city}, {member.location.state}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leave Group */}
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors">
            <LogOut size={16} /> Leave Tribe
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 pt-16">
      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">My Tribes</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus size={16} /> New Tribe
          </button>
        </div>

        {/* Tribe List */}
        <div className="space-y-3">
          {userTribes.map((tribe) => (
            <button
              key={tribe.id}
              onClick={() => { setSelectedTribe(tribe); setView('detail'); }}
              className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: tribe.color + '20' }}>
                  <Users size={22} style={{ color: tribe.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800">{tribe.name}</h3>
                    {tribe.password && <Lock size={12} className="text-amber-500" />}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{tribe.description}</p>
                  <p className="text-xs text-slate-400 mt-1">{tribe.memberCount} members</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Browse Other Tribes */}
        <div>
          <h3 className="font-semibold text-slate-700 mb-3">Discover Tribes</h3>
          <div className="space-y-2">
            {allTribes
              .filter((t) => !t.members.includes(user.id))
              .map((tribe) => (
                <div key={tribe.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: tribe.color + '20' }}>
                      <Users size={18} style={{ color: tribe.color }} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-slate-800">{tribe.name}</h4>
                      <p className="text-xs text-slate-400">{tribe.memberCount} members</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-emerald-600 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors">
                    Join
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Create Tribe Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Create a Tribe</h3>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Tribe Name</label>
                <input
                  type="text"
                  value={newTribe.name}
                  onChange={(e) => setNewTribe({ ...newTribe, name: e.target.value })}
                  placeholder="e.g., Bay Area Hikers"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
                <textarea
                  value={newTribe.description}
                  onChange={(e) => setNewTribe({ ...newTribe, description: e.target.value })}
                  placeholder="What is this tribe about?"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Password (optional)</label>
                <input
                  type="text"
                  value={newTribe.password}
                  onChange={(e) => setNewTribe({ ...newTribe, password: e.target.value })}
                  placeholder="Leave blank for open access"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Color</label>
                <div className="flex gap-2">
                  {['#10b981', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#f97316', '#06b6d4'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewTribe({ ...newTribe, color: c })}
                      className={`w-8 h-8 rounded-full ${newTribe.color === c ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={handleCreateTribe}
                disabled={!newTribe.name.trim()}
                className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Tribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
