import { createContext, useContext, useState } from 'react';
import { currentUser, users, tribes, places, gear, events, callouts, messages } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(currentUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [allUsers] = useState(users);
  const [allTribes, setAllTribes] = useState(tribes);
  const [allPlaces] = useState(places);
  const [allGear] = useState(gear);
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

  return (
    <AppContext.Provider
      value={{
        user, setUser, isLoggedIn, login, logout,
        allUsers, allTribes, allPlaces, allGear, allEvents,
        allCallouts, addCallout, respondToCallout,
        allMessages, sendMessage,
        notifications, markNotificationRead,
        getNearbyUsers, getUserTribes, getUserById, getTribeById,
        createTribe,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
