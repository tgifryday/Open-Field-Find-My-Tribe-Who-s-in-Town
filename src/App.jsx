import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MapView from './pages/MapView';
import Tribes from './pages/Tribes';
import Callouts from './pages/Callouts';
import Search from './pages/Search';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Admin from './pages/Admin';

function AppContent() {
  const { isLoggedIn } = useApp();
  const location = useLocation();

  // Admin page has its own layout (no header/nav)
  if (location.pathname === '/admin') {
    return <Admin />;
  }

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/tribes" element={<Tribes />} />
          <Route path="/callouts" element={<Callouts />} />
          <Route path="/search" element={<Search />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/:userId" element={<UserProfile />} />
        </Routes>
      </main>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </HashRouter>
  );
}
