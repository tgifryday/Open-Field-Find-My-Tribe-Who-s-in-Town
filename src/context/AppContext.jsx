import { createContext, useContext, useState, useCallback } from 'react';
import { currentUser, users, tribes, places, gear, vehicles, events, callouts, messages, locations } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(currentUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [allUsers] = useState(users);
  const [allTribes, setAllTribes] = useState(tribes);
  const [allPlaces, setAllPlaces] = useState(places);
  const [allGear, setAllGear] = useState(gear);
  const [allVehicles, setAllVehicles] = useState(vehicles);
  const [allEvents] = useState(events);
  const [allCallouts, setAllCallouts] = useState(callouts);
  const [allMessages, setAllMessages] = useState(messages);
  const [allLocations, setAllLocations] = useState(locations);
  const [notifications, setNotifications] = useState([
    { id: 'n1', type: 'callout', message: 'Eli Brooks is looking for people in Los Angeles', time: '2h ago', read: false, calloutId: 'callout-1' },
    { id: 'n2', type: 'event', message: 'Sunset Yoga at Venice is tomorrow', time: '4h ago', read: false },
    { id: 'n3', type: 'message', message: 'New message in LA Nomads - Downtown Area', time: '6h ago', read: true },
  ]);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

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

  // Resolve position for a place/vehicle/gear item
  const getItemLocation = useCallback((item) => {
    if (item.borrowedBy) {
      return getUserCurrentLocation(item.borrowedBy);
    }
    const loc = allLocations.find((l) => l.id === item.locationId);
    if (!loc) return null;
    return { lat: loc.lat, lng: loc.lng, city: loc.city, state: loc.state, name: loc.name, address: loc.address };
  }, [allLocations, getUserCurrentLocation]);

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

  // Place CRUD
  const addPlace = (place) => {
    const newPlace = { ...place, id: `place-${Date.now()}`, addedBy: user.id, rating: 0, inUseBy: null };
    setAllPlaces((prev) => [...prev, newPlace]);
    return newPlace;
  };

  // Vehicle CRUD
  const addVehicle = (vehicle) => {
    const newVehicle = { ...vehicle, id: `vehicle-${Date.now()}`, owner: user.id, borrowedBy: null };
    setAllVehicles((prev) => [...prev, newVehicle]);
    return newVehicle;
  };

  // Gear CRUD
  const addGear = (gearItem) => {
    const newGear = { ...gearItem, id: `gear-${Date.now()}`, owner: user.id, borrowedBy: null };
    setAllGear((prev) => [...prev, newGear]);
    return newGear;
  };

  // Direct messaging
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

  // Get listings by user
  const getUserPlaces = (userId) => allPlaces.filter((p) => p.addedBy === userId);
  const getUserVehicles = (userId) => allVehicles.filter((v) => v.owner === userId);
  const getUserGear = (userId) => allGear.filter((g) => g.owner === userId);
  const getUserLocations = (userId) => {
    const u = allUsers.find((usr) => usr.id === userId) || (userId === user.id ? user : null);
    if (!u) return [];
    return (u.locationIds || []).map((id) => allLocations.find((l) => l.id === id)).filter(Boolean);
  };

  return (
    <AppContext.Provider
      value={{
        user, setUser, isLoggedIn, login, logout,
        allUsers, allTribes, allPlaces, allGear, allVehicles, allEvents, allLocations,
        allCallouts, addCallout, respondToCallout,
        allMessages, sendMessage,
        notifications, markNotificationRead,
        getNearbyUsers, getUserTribes, getUserById, getTribeById,
        createTribe,
        getLocationById, getUserCurrentLocation, getItemLocation,
        addLocation, addPlace, addVehicle, addGear,
        startDirectMessage,
        getUserPlaces, getUserVehicles, getUserGear, getUserLocations,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
