import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Users, MapPin, Car, Package, Calendar, Megaphone, Map, MessageCircle, LogOut, Trash2, Edit3, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';

const collections = [
  { id: 'users', label: 'Users', icon: Users, fields: ['id', 'name', 'bio', 'interests'] },
  { id: 'tribes', label: 'Tribes', icon: Users, fields: ['id', 'name', 'description', 'memberCount', 'color'] },
  { id: 'places', label: 'Places', icon: MapPin, fields: ['id', 'name', 'type', 'description', 'cost', 'locationId', 'addedBy'] },
  { id: 'vehicles', label: 'Vehicles', icon: Car, fields: ['id', 'name', 'type', 'cost', 'available', 'owner', 'locationId'] },
  { id: 'gear', label: 'Gear', icon: Package, fields: ['id', 'name', 'cost', 'available', 'owner', 'locationId'] },
  { id: 'events', label: 'Events', icon: Calendar, fields: ['id', 'name', 'date', 'time', 'locationId', 'attendees'] },
  { id: 'callouts', label: 'Callouts', icon: Megaphone, fields: ['id', 'senderName', 'tribeName', 'message', 'createdAt'] },
  { id: 'locations', label: 'Locations', icon: Map, fields: ['id', 'name', 'address', 'city', 'state', 'lat', 'lng'] },
  { id: 'messages', label: 'Messages', icon: MessageCircle, fields: ['id', 'name', 'type'] },
];

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(email, password);
    if (!success) setError('Invalid credentials');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Admin Console</h1>
          <p className="text-sm text-slate-400 mt-1">Open Field Administration</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@openfield.app"
              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1.5 block">Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-5 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button type="submit" className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition-colors">
            Sign In
          </button>
        </form>
        <p className="text-xs text-slate-400 text-center">
          Demo: admin@openfield.app / admin123
        </p>
      </div>
    </div>
  );
}

function DataTable({ collection, data, onDelete, onEdit }) {
  const config = collections.find((c) => c.id === collection);
  const [expandedRow, setExpandedRow] = useState(null);

  if (!config) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {config.fields.map((field) => (
                <th key={field} className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider whitespace-nowrap">
                  {field}
                </th>
              ))}
              <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                {config.fields.map((field) => (
                  <td key={field} className="px-4 py-3.5 text-slate-700 max-w-[200px] truncate">
                    {Array.isArray(item[field])
                      ? item[field].join(', ')
                      : typeof item[field] === 'boolean'
                        ? item[field] ? 'Yes' : 'No'
                        : String(item[field] ?? '-')}
                  </td>
                ))}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Expand"
                    >
                      {expandedRow === item.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => { if (window.confirm(`Delete ${item.name || item.id}?`)) onDelete(collection, item.id); }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="text-center py-8 text-sm text-slate-400">No records found</div>
      )}
    </div>
  );
}

function EditModal({ item, collection, onSave, onClose }) {
  const config = collections.find((c) => c.id === collection);
  const [formData, setFormData] = useState({ ...item });

  const allFields = Object.keys(item).filter((k) => k !== 'messages' && k !== 'responses' && k !== 'members' && k !== 'liveLocation');

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-800">Edit {config?.label?.slice(0, -1) || 'Record'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          {allFields.map((field) => (
            <div key={field}>
              <label className="text-xs font-medium text-slate-500 mb-1 block uppercase tracking-wider">{field}</label>
              {field === 'id' ? (
                <p className="text-sm text-slate-400 px-5 py-3 rounded-xl bg-slate-50">{formData[field]}</p>
              ) : typeof item[field] === 'boolean' ? (
                <select
                  value={String(formData[field])}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value === 'true' })}
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              ) : typeof item[field] === 'number' ? (
                <input
                  type="number" value={formData[field] ?? ''} onChange={(e) => setFormData({ ...formData, [field]: parseFloat(e.target.value) || 0 })}
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : Array.isArray(item[field]) ? (
                <input
                  type="text" value={Array.isArray(formData[field]) ? formData[field].join(', ') : formData[field] ?? ''}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value.split(', ') })}
                  placeholder="Comma-separated values"
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : typeof item[field] === 'object' && item[field] !== null ? (
                <textarea
                  value={JSON.stringify(formData[field], null, 2)}
                  onChange={(e) => { try { setFormData({ ...formData, [field]: JSON.parse(e.target.value) }); } catch {} }}
                  rows={3}
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <input
                  type="text" value={formData[field] ?? ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => { onSave(collection, formData.id, formData); onClose(); }}
          className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default function Admin() {
  const {
    isAdmin, adminLogin, adminLogout,
    allUsers, allTribes, allPlaces, allGear, allVehicles, allEvents,
    allCallouts, allLocations, allMessages,
    deleteItem, updateItem,
  } = useApp();

  const [activeCollection, setActiveCollection] = useState('users');
  const [editingItem, setEditingItem] = useState(null);

  if (!isAdmin) {
    return <AdminLogin onLogin={adminLogin} />;
  }

  const dataMap = {
    users: allUsers,
    tribes: allTribes,
    places: allPlaces,
    gear: allGear,
    vehicles: allVehicles,
    events: allEvents,
    callouts: allCallouts,
    locations: allLocations,
    messages: allMessages,
  };

  const currentData = dataMap[activeCollection] || [];
  const activeConfig = collections.find((c) => c.id === activeCollection);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-emerald-400" />
          <h1 className="font-bold text-base">Open Field Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <a href="#/" className="text-sm text-slate-400 hover:text-white transition-colors">Back to App</a>
          <button onClick={adminLogout} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-slate-200 min-h-[calc(100vh-48px)] p-4 shrink-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">Data</p>
          <nav className="space-y-1">
            {collections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveCollection(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeCollection === id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} />
                {label}
                <span className="ml-auto text-xs text-slate-400">{(dataMap[id] || []).length}</span>
              </button>
            ))}
          </nav>

          {/* Stats */}
          <div className="mt-8 p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-semibold text-slate-500 mb-2">Quick Stats</p>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between"><span>Users</span><span className="font-bold">{allUsers.length}</span></div>
              <div className="flex justify-between"><span>Tribes</span><span className="font-bold">{allTribes.length}</span></div>
              <div className="flex justify-between"><span>Places</span><span className="font-bold">{allPlaces.length}</span></div>
              <div className="flex justify-between"><span>Vehicles</span><span className="font-bold">{allVehicles.length}</span></div>
              <div className="flex justify-between"><span>Events</span><span className="font-bold">{allEvents.length}</span></div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {activeConfig && <activeConfig.icon size={20} />}
                {activeConfig?.label || 'Data'}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">{currentData.length} records</p>
            </div>
          </div>

          <DataTable
            collection={activeCollection}
            data={currentData}
            onDelete={deleteItem}
            onEdit={setEditingItem}
          />
        </main>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EditModal
          item={editingItem}
          collection={activeCollection}
          onSave={updateItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
