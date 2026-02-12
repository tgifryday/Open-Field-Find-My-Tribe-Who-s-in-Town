import { createContext, useContext, useState } from 'react';
import { currentUser, users, tribes, places, gear, vehicles, events, callouts, messages } from '../data/mockData';

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
  const [notifications, setNotifications] = useState([
    { id: 'n1', type: 'callout', message: 'Eli Brooks is looking for people in Los Angeles', time: '2h ago', read: false, calloutId: 'callout-1' },
    { id: 'n2', type: 'event', message: 'Sunset Yoga at Venice is tomorrow', time: '4h ago', read: false },
    { id: 'n3', type: 'message', message: 'New message in LA Nomads - Downtown Area', time: '6h ago', read: true },
  ]);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

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

  const getUserById = (id) => allUsers.find((u) => u.id === id);
  const getTribeById = (id) => allTribes.find((t) => t.id === id);

  // Place CRUD
  const addPlace = (place) => {
    const newPlace = {
      ...place,
      id: `place-${Date.now()}`,
      addedBy: user.id,
      rating: 0,
    };
    setAllPlaces((prev) => [...prev, newPlace]);
    return newPlace;
  };

  // Vehicle CRUD
  const addVehicle = (vehicle) => {
    const newVehicle = {
      ...vehicle,
      id: `vehicle-${Date.now()}`,
      owner: user.id,
    };
    setAllVehicles((prev) => [...prev, newVehicle]);
    return newVehicle;
  };

  // Gear CRUD
  const addGear = (gearItem) => {
    const newGear = {
      ...gearItem,
      id: `gear-${Date.now()}`,
      owner: user.id,
    };
    setAllGear((prev) => [...prev, newGear]);
    return newGear;
  };

  // Direct messaging
  const startDirectMessage = (otherUserId) => {
    const otherUser = getUserById(otherUserId);
    if (!otherUser) return null;

    // Check if DM thread already exists
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

  return (
    <AppContext.Provider
      value={{
        user, setUser, isLoggedIn, login, logout,
        allUsers, allTribes, allPlaces, allGear, allVehicles, allEvents,
        allCallouts, addCallout, respondToCallout,
        allMessages, sendMessage,
        notifications, markNotificationRead,
        getNearbyUsers, getUserTribes, getUserById, getTribeById,
        createTribe,
        addPlace, addVehicle, addGear,
        startDirectMessage,
        getUserPlaces, getUserVehicles, getUserGear,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
