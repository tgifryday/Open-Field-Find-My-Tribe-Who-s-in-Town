import { createContext, useContext, useState, useCallback } from 'react';
import { currentUser, users, tribes, places, gear, vehicles, events, callouts, messages, locations } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(currentUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState(users);
  const [allTribes, setAllTribes] = useState(tribes);
  const [allPlaces, setAllPlaces] = useState(places);
  const [allGear, setAllGear] = useState(gear);
  const [allVehicles, setAllVehicles] = useState(vehicles);
  const [allEvents, setAllEvents] = useState(events);
  const [allCallouts, setAllCallouts] = useState(callouts);
  const [allMessages, setAllMessages] = useState(messages);
  const [allLocations, setAllLocations] = useState(locations);
  const [notifications, setNotifications] = useState([
    { id: 'n1', type: 'callout', message: 'Eli Brooks is looking for people in Los Angeles', time: '2h ago', read: false, calloutId: 'callout-1' },
    { id: 'n2', type: 'event', message: 'Sunset Yoga at Venice is tomorrow', time: '4h ago', read: false },
    { id: 'n3', type: 'message', message: 'New message in LA Nomads - Downtown Area', time: '6h ago', read: true },
  ]);

  const login = () => setIsLoggedIn(true);
  const logout = () => { setIsLoggedIn(false); setIsAdmin(false); };
  const adminLogin = (email, password) => {
    if (email === 'admin@openfield.app' && password === 'admin123') {
      setIsAdmin(true);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };
  const adminLogout = () => { setIsAdmin(false); };

  // Location helpers
  const getLocationById = useCallback((id) => {
    return allLocations.find((l) => l.id === id) || null;
  }, [allLocations]);

  const getUserById = (id) => allUsers.find((u) => u.id === id);
  const getTribeById = (id) => allTribes.find((t) => t.id === id);

  const getUserCurrentLocation = useCallback((userId) => {
    const u = allUsers.find((usr) => usr.id === userId) || (userId === user.id ? user : null);
    if (!u) return null;
    if (u.useLiveLocation && u.liveLocation) {
      const loc = allLocations.find((l) => l.id === u.currentLocationId);
      return {
        lat: u.liveLocation.lat,
        lng: u.liveLocation.lng,
        city: loc?.city || 'Unknown',
        state: loc?.state || '',
        name: loc?.name || '',
      };
    }
    const loc = allLocations.find((l) => l.id === u.currentLocationId);
    if (!loc) return null;
    return { lat: loc.lat, lng: loc.lng, city: loc.city, state: loc.state, name: loc.name };
  }, [allUsers, allLocations, user]);

  const getItemLocation = useCallback((item) => {
    if (item.borrowedBy) {
      return getUserCurrentLocation(item.borrowedBy);
    }
    const loc = allLocations.find((l) => l.id === item.locationId);
    if (!loc) return null;
    return { lat: loc.lat, lng: loc.lng, city: loc.city, state: loc.state, name: loc.name, address: loc.address };
  }, [allLocations, getUserCurrentLocation]);

  // --- User actions ---
  const updateProfile = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
    setAllUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, ...updates } : u));
  };

  const addFutureLocation = (locationId, date) => {
    setUser((prev) => ({
      ...prev,
      futureLocations: [...(prev.futureLocations || []), { locationId, date }],
    }));
  };

  // --- Tribe actions ---
  const addCallout = (callout) => {
    setAllCallouts((prev) => [{ ...callout, id: `callout-${Date.now()}`, responses: [], createdAt: new Date().toISOString() }, ...prev]);
  };

  const respondToCallout = (calloutId, response) => {
    setAllCallouts((prev) =>
      prev.map((c) =>
        c.id === calloutId
          ? { ...c, responses: [...c.responses, { ...response, respondedAt: new Date().toISOString() }] }
          : c
      )
    );
  };

  const sendMessage = (threadId, message) => {
    setAllMessages((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, messages: [...t.messages, { ...message, time: new Date().toISOString() }] }
          : t
      )
    );
  };

  const createTribe = (tribe) => {
    const newTribe = {
      ...tribe,
      id: `tribe-${Date.now()}`,
      members: [user.id],
      owners: [user.id],
      admins: [],
      memberCount: 1,
    };
    setAllTribes((prev) => [...prev, newTribe]);
    return newTribe;
  };

  const joinTribe = (tribeId) => {
    setAllTribes((prev) =>
      prev.map((t) =>
        t.id === tribeId && !t.members.includes(user.id)
          ? { ...t, members: [...t.members, user.id], memberCount: t.memberCount + 1 }
          : t
      )
    );
  };

  const leaveTribe = (tribeId) => {
    setAllTribes((prev) =>
      prev.map((t) =>
        t.id === tribeId
          ? { ...t, members: t.members.filter((m) => m !== user.id), memberCount: Math.max(0, t.memberCount - 1) }
          : t
      )
    );
  };

  // --- Event actions ---
  const rsvpEvent = (eventId) => {
    setAllEvents((prev) =>
      prev.map((e) => e.id === eventId ? { ...e, attendees: e.attendees + 1 } : e)
    );
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const getNearbyUsers = (radiusMiles = 50) => {
    return allUsers.filter((u) => u.id !== user.id && (u.distance || 0) <= radiusMiles);
  };

  const getUserTribes = () => {
    return allTribes.filter((t) => t.members.includes(user.id));
  };

  // Location CRUD
  const addLocation = (loc) => {
    const newLoc = { ...loc, id: `loc-${Date.now()}`, createdBy: user.id };
    setAllLocations((prev) => [...prev, newLoc]);
    return newLoc;
  };

  const addPlace = (place) => {
    const newPlace = { ...place, id: `place-${Date.now()}`, addedBy: user.id, rating: 0, inUseBy: null };
    setAllPlaces((prev) => [...prev, newPlace]);
    return newPlace;
  };

  const addVehicle = (vehicle) => {
    const newVehicle = { ...vehicle, id: `vehicle-${Date.now()}`, owner: user.id, borrowedBy: null };
    setAllVehicles((prev) => [...prev, newVehicle]);
    return newVehicle;
  };

  const addGear = (gearItem) => {
    const newGear = { ...gearItem, id: `gear-${Date.now()}`, owner: user.id, borrowedBy: null };
    setAllGear((prev) => [...prev, newGear]);
    return newGear;
  };

  const startDirectMessage = (otherUserId) => {
    const otherUser = getUserById(otherUserId);
    if (!otherUser) return null;
    const existing = allMessages.find(
      (t) => t.type === 'direct' && t.members.includes(user.id) && t.members.includes(otherUserId)
    );
    if (existing) return existing.id;
    const newThread = {
      id: `dm-${Date.now()}`,
      name: otherUser.name,
      type: 'direct',
      members: [user.id, otherUserId],
      messages: [],
    };
    setAllMessages((prev) => [newThread, ...prev]);
    return newThread.id;
  };

  const getUserPlaces = (userId) => allPlaces.filter((p) => p.addedBy === userId);
  const getUserVehicles = (userId) => allVehicles.filter((v) => v.owner === userId);
  const getUserGear = (userId) => allGear.filter((g) => g.owner === userId);
  const getUserLocations = (userId) => {
    const u = allUsers.find((usr) => usr.id === userId) || (userId === user.id ? user : null);
    if (!u) return [];
    return (u.locationIds || []).map((id) => allLocations.find((l) => l.id === id)).filter(Boolean);
  };

  // --- Admin CRUD ---
  const deleteItem = (collection, id) => {
    const setters = {
      users: setAllUsers, tribes: setAllTribes, places: setAllPlaces,
      gear: setAllGear, vehicles: setAllVehicles, events: setAllEvents,
      callouts: setAllCallouts, locations: setAllLocations, messages: setAllMessages,
    };
    const setter = setters[collection];
    if (setter) setter((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (collection, id, updates) => {
    const setters = {
      users: setAllUsers, tribes: setAllTribes, places: setAllPlaces,
      gear: setAllGear, vehicles: setAllVehicles, events: setAllEvents,
      callouts: setAllCallouts, locations: setAllLocations, messages: setAllMessages,
    };
    const setter = setters[collection];
    if (setter) setter((prev) => prev.map((item) => item.id === id ? { ...item, ...updates } : item));
  };

  const addItem = (collection, item) => {
    const setters = {
      users: setAllUsers, tribes: setAllTribes, places: setAllPlaces,
      gear: setAllGear, vehicles: setAllVehicles, events: setAllEvents,
      callouts: setAllCallouts, locations: setAllLocations, messages: setAllMessages,
    };
    const setter = setters[collection];
    if (setter) setter((prev) => [...prev, { ...item, id: `${collection.slice(0, -1)}-${Date.now()}` }]);
  };

  return (
    <AppContext.Provider
      value={{
        user, setUser, isLoggedIn, login, logout,
        isAdmin, adminLogin, adminLogout,
        allUsers, allTribes, allPlaces, allGear, allVehicles, allEvents, allLocations,
        allCallouts, addCallout, respondToCallout,
        allMessages, sendMessage,
        notifications, markNotificationRead,
        getNearbyUsers, getUserTribes, getUserById, getTribeById,
        createTribe, joinTribe, leaveTribe,
        updateProfile, addFutureLocation, rsvpEvent,
        getLocationById, getUserCurrentLocation, getItemLocation,
        addLocation, addPlace, addVehicle, addGear,
        startDirectMessage,
        getUserPlaces, getUserVehicles, getUserGear, getUserLocations,
        deleteItem, updateItem, addItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
