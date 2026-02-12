import { useState } from 'react';
import { MapPin, Users, Megaphone, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const features = [
  { icon: MapPin, title: 'Find Your Tribe', desc: 'Discover people near you who share your interests and lifestyle.' },
  { icon: Users, title: 'Build Community', desc: 'Create or join tribes for co-working, adventure, van life & more.' },
  { icon: Megaphone, title: "Who's in Town?", desc: 'Send callouts to your tribe when traveling. Find friends nearby.' },
];

export default function Login() {
  const { login } = useApp();
  const [step, setStep] = useState(0);

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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
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
            onClick={login}
            className="w-full bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-emerald-700 transition-all shadow-lg"
          >
            Continue with Demo Account
          </button>
          <p className="text-center text-xs text-slate-400 mt-4">
            In production, this would support social login (Facebook, Google, etc.)
          </p>
        </div>
      </div>
    </div>
  );
}
