import { useState } from 'react';
import { MapPin, Users, Megaphone, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const features = [
  { icon: MapPin, title: 'Find Your Tribe', desc: 'Discover people near you who share your interests and lifestyle.' },
  { icon: Users, title: 'Build Community', desc: 'Create or join tribes for co-working, adventure, van life & more.' },
  { icon: Megaphone, title: "Who's in Town?", desc: 'Send callouts to your tribe when traveling. Find friends nearby.' },
];

const interestOptions = [
  'hiking', 'surfing', 'yoga', 'co-working', 'van life', 'camping',
  'cooking', 'music', 'photography', 'climbing', 'foraging', 'art',
  'writing', 'running', 'meditation', 'dance', 'gardening', 'tech',
  'board games', 'food', 'travel', 'fitness',
];

export default function Login() {
  const { login, createNewUser } = useApp();
  const [step, setStep] = useState(0);
  const [newUser, setNewUser] = useState({ name: '', bio: '', interests: [] });

  const toggleInterest = (interest) => {
    setNewUser((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleCreateAccount = () => {
    createNewUser({
      name: newUser.name.trim() || 'Explorer',
      bio: newUser.bio.trim(),
      interests: newUser.interests.length > 0 ? newUser.interests : ['hiking', 'co-working', 'van life', 'foraging'],
    });
  };

  // Step 0: Welcome screen
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 flex flex-col items-center justify-center p-6 text-white">
        <div className="text-center mb-12">
          <span className="text-6xl mb-4 block">🌿</span>
          <h1 className="text-4xl font-bold mb-2">Open Field</h1>
          <p className="text-emerald-100 text-lg">Find Your Tribe</p>
        </div>
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => setStep(1)}
            className="w-full bg-white text-emerald-700 font-semibold py-3 px-6 rounded-xl hover:bg-emerald-50 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Get Started <ArrowRight size={18} />
          </button>
          <button
            onClick={login}
            className="w-full bg-emerald-500/30 text-white font-semibold py-3 px-6 rounded-xl hover:bg-emerald-500/40 transition-all border border-emerald-400/30"
          >
            I already have an account
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Feature overview
  if (step === 1) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <button onClick={() => setStep(0)} className="flex items-center gap-1 text-sm text-slate-400 mb-6 hover:text-slate-600">
              <ArrowLeft size={16} /> Back
            </button>
            <div className="text-center mb-8">
              <span className="text-4xl mb-3 block">🌿</span>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome to Open Field</h2>
              <p className="text-slate-500">Connect with your tribe, wherever you are.</p>
            </div>
            <div className="space-y-4 mb-8">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Create My Account <ArrowRight size={18} />
            </button>
            <button
              onClick={login}
              className="w-full text-sm text-slate-400 mt-4 py-2 hover:text-slate-600 transition-colors"
            >
              Skip — Continue with Demo Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Name & Bio
  if (step === 2) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-slate-400 mb-6 hover:text-slate-600">
              <ArrowLeft size={16} /> Back
            </button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Tell us about you</h2>
              <p className="text-slate-500 text-sm">This helps your tribe find you.</p>
            </div>
            <div className="space-y-5 mb-8">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Your Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="What should people call you?"
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Bio</label>
                <textarea
                  value={newUser.bio}
                  onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })}
                  placeholder="A little about yourself... What are you about? What are you looking for?"
                  rows={3}
                  className="w-full px-5 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
            <button
              onClick={() => setStep(3)}
              disabled={!newUser.name.trim()}
              className="w-full bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Next: Pick Interests <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Interests
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-slate-400 mb-6 hover:text-slate-600">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <MapPin size={28} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Pick your interests</h2>
            <p className="text-slate-500 text-sm">Select what you're into. This helps match you with the right tribes.</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  newUser.interests.includes(interest)
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {newUser.interests.includes(interest) && <Check size={14} className="inline mr-1 -mt-0.5" />}
                {interest}
              </button>
            ))}
          </div>
          {newUser.interests.length > 0 && (
            <p className="text-center text-xs text-emerald-600 mb-4">
              {newUser.interests.length} interest{newUser.interests.length !== 1 ? 's' : ''} selected
            </p>
          )}
          <button
            onClick={handleCreateAccount}
            className="w-full bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Join Open Field <ArrowRight size={18} />
          </button>
          <button
            onClick={handleCreateAccount}
            className="w-full text-sm text-slate-400 mt-3 py-2 hover:text-slate-600 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
