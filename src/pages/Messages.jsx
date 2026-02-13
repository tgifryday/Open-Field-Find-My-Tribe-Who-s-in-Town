import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Send, MapPin, Users, WifiOff, ArrowLeft, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';

export default function Messages() {
  const { user, allMessages, sendMessage, getTribeById, getUserById } = useApp();
  const [selectedThread, setSelectedThread] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openThread) {
      setSelectedThread(location.state.openThread);
    }
  }, [location.state]);

  const groupThreads = allMessages.filter((t) => t.type === 'group' || !t.type);
  const directThreads = allMessages.filter((t) => t.type === 'direct');

  const handleSend = () => {
    if (!newMessage.trim() || !selectedThread) return;
    sendMessage(selectedThread, {
      userId: user.id,
      userName: 'You',
      text: newMessage.trim(),
    });
    setNewMessage('');
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' });
  };

  if (selectedThread) {
    const thread = allMessages.find((t) => t.id === selectedThread);
    if (!thread) return null;
    const isDirect = thread.type === 'direct';
    const otherUserId = isDirect ? thread.members.find((m) => m !== user.id) : null;
    const otherUser = otherUserId ? getUserById(otherUserId) : null;

    return (
      <div className="pb-24 pt-[76px] flex flex-col h-[calc(100vh-0px)]">
        {/* Thread Header */}
        <div className="fixed top-14 left-0 right-0 bg-white border-b border-slate-200 z-40 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button onClick={() => setSelectedThread(null)} className="p-1 rounded-lg hover:bg-slate-100">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-slate-800 truncate">
                {isDirect ? (otherUser?.name || 'Direct Message') : thread.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                {isDirect ? (
                  <>
                    <User size={10} />
                    <span>Direct message</span>
                  </>
                ) : (
                  <>
                    <MapPin size={10} />
                    <span>{thread.radius?.miles} mi radius</span>
                    <span className="mx-1">&middot;</span>
                    <Users size={10} />
                    <span>{thread.members.length} in range</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 pt-28 pb-20 space-y-3">
          {!isDirect && (
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <p className="text-xs text-emerald-600">
                This thread is based on proximity. Members within {thread.radius?.miles} miles of the center can participate.
              </p>
            </div>
          )}
          {isDirect && thread.messages.length === 0 && (
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-xs text-blue-600">
                Start a conversation with {otherUser?.name || 'this person'}. Say hello!
              </p>
            </div>
          )}
          {thread.messages.map((msg, i) => {
            const isMe = msg.userId === user.id;
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : ''}`}>
                  {!isMe && <Avatar name={msg.userName} size="sm" />}
                  <div>
                    {!isMe && <p className="text-[10px] text-slate-400 mb-0.5 ml-1">{msg.userName}</p>}
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-md'
                          : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <p className={`text-[10px] text-slate-300 mt-0.5 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                      {formatTime(msg.time)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-[76px]">
      <div className="px-4 py-4 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Messages</h2>

        {/* Direct Messages */}
        {directThreads.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <User size={12} /> Direct Messages
            </h3>
            <div className="space-y-2">
              {directThreads.map((thread) => {
                const otherUserId = thread.members.find((m) => m !== user.id);
                const otherUser = getUserById(otherUserId);
                const lastMsg = thread.messages[thread.messages.length - 1];
                return (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={otherUser?.name || '?'} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm text-slate-800 truncate">{otherUser?.name || 'Unknown'}</h3>
                          {lastMsg && <span className="text-[10px] text-slate-400">{formatTime(lastMsg.time)}</span>}
                        </div>
                        {lastMsg ? (
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            <span className="font-medium">{lastMsg.userName}:</span> {lastMsg.text}
                          </p>
                        ) : (
                          <p className="text-xs text-slate-400 mt-0.5">No messages yet</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Group Threads */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <MapPin size={12} /> Group Threads
          </h3>
          <div className="space-y-2">
            {groupThreads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              return (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThread(thread.id)}
                  className="w-full text-left bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <MessageCircle size={18} className="text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm text-slate-800 truncate">{thread.name}</h3>
                        <span className="text-[10px] text-slate-400">{formatTime(lastMsg.time)}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        <span className="font-medium">{lastMsg.userName}:</span> {lastMsg.text}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                        <Users size={10} /> {thread.members.length} members &middot; {thread.radius?.miles} mi radius
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {groupThreads.length === 0 && directThreads.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No active message threads</p>
            <p className="text-slate-300 text-xs mt-1">Threads are created based on proximity within your tribes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
