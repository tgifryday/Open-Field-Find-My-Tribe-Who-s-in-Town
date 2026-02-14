// ─── LOCATIONS TABLE ─────────────────────────────────────────────────────────
// All static locations referenced by users, places, vehicles, and gear.
export const locations = [
  // User home bases
  { id: 'loc-1', name: 'Downtown LA', address: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, city: 'Los Angeles', state: 'CA', createdBy: 'user-1' },
  { id: 'loc-2', name: 'Santa Monica Pad', address: 'Santa Monica, CA', lat: 34.0195, lng: -118.4912, city: 'Santa Monica', state: 'CA', createdBy: 'user-2' },
  { id: 'loc-3', name: 'Echo Park Base', address: 'Echo Park, LA, CA', lat: 34.0736, lng: -118.2400, city: 'Echo Park', state: 'CA', createdBy: 'user-3' },
  { id: 'loc-4', name: 'Pasadena Home', address: 'Pasadena, CA', lat: 34.1478, lng: -118.1445, city: 'Pasadena', state: 'CA', createdBy: 'user-4' },
  { id: 'loc-5', name: 'Playa del Rey Spot', address: 'Playa del Rey, CA', lat: 33.9425, lng: -118.4081, city: 'Playa del Rey', state: 'CA', createdBy: 'user-5' },
  { id: 'loc-6', name: 'Culver City Home', address: 'Culver City, CA', lat: 34.0259, lng: -118.3963, city: 'Culver City', state: 'CA', createdBy: 'user-6' },
  { id: 'loc-7', name: 'SF Home', address: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, city: 'San Francisco', state: 'CA', createdBy: 'user-7' },
  { id: 'loc-8', name: 'Mid-City Spot', address: 'Mid-City, LA, CA', lat: 34.0622, lng: -118.3537, city: 'Mid-City', state: 'CA', createdBy: 'user-8' },
  // Future travel locations (user-1)
  { id: 'loc-9', name: 'SF Trip', address: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, city: 'San Francisco', state: 'CA', createdBy: 'user-1' },
  { id: 'loc-10', name: 'Portland Trip', address: 'Portland, OR', lat: 45.5152, lng: -122.6784, city: 'Portland', state: 'OR', createdBy: 'user-1' },
  // Place-specific locations
  { id: 'loc-11', name: 'Echo Park Lake', address: 'Echo Park Lake, LA, CA', lat: 34.0781, lng: -118.2606, city: 'Los Angeles', state: 'CA', createdBy: 'user-3' },
  { id: 'loc-12', name: 'Groundwork Coffee', address: 'Downtown LA', lat: 34.0563, lng: -118.2373, city: 'Los Angeles', state: 'CA', createdBy: 'user-2' },
  { id: 'loc-13', name: 'Venice Beach Lot', address: 'Venice Beach, CA', lat: 33.9850, lng: -118.4695, city: 'Venice', state: 'CA', createdBy: 'user-5' },
  { id: 'loc-14', name: 'LA Fitness Sawtelle', address: 'Sawtelle, LA, CA', lat: 34.0289, lng: -118.4530, city: 'Los Angeles', state: 'CA', createdBy: 'user-6' },
  { id: 'loc-15', name: 'Griffith Park', address: 'Griffith Park, LA, CA', lat: 34.1341, lng: -118.2988, city: 'Los Angeles', state: 'CA', createdBy: 'user-4' },
  { id: 'loc-16', name: 'The Last Bookstore', address: '453 S Spring St, DTLA', lat: 34.0476, lng: -118.2490, city: 'Los Angeles', state: 'CA', createdBy: 'user-7' },
  { id: 'loc-17', name: 'Elysian Park', address: 'Elysian Park, LA, CA', lat: 34.0825, lng: -118.2350, city: 'Los Angeles', state: 'CA', createdBy: 'user-3' },
  { id: 'loc-18', name: 'Mulholland Overlook', address: 'Mulholland Dr, LA, CA', lat: 34.1285, lng: -118.3268, city: 'Los Angeles', state: 'CA', createdBy: 'user-5' },
  { id: 'loc-19', name: 'WeWork Santa Monica', address: 'Santa Monica, CA', lat: 34.0195, lng: -118.4965, city: 'Santa Monica', state: 'CA', createdBy: 'user-2' },
  { id: 'loc-20', name: 'Community Kitchen DTLA', address: 'Arts District, DTLA', lat: 34.0407, lng: -118.2468, city: 'Los Angeles', state: 'CA', createdBy: 'user-6' },
  { id: 'loc-21', name: 'Silver Lake House', address: '1234 Sunset Blvd, Silver Lake, CA', lat: 34.0869, lng: -118.2702, city: 'Los Angeles', state: 'CA', createdBy: 'user-6' },
  { id: 'loc-22', name: 'DTLA Garage', address: '456 Main St, DTLA, CA', lat: 34.0625, lng: -118.2275, city: 'Los Angeles', state: 'CA', createdBy: 'user-3' },
  { id: 'loc-23', name: 'Culver City Backyard', address: '789 Oak Ave, Culver City, CA', lat: 34.0350, lng: -118.3900, city: 'Culver City', state: 'CA', createdBy: 'user-6' },
  { id: 'loc-24', name: 'Echo Park Session Room', address: '321 Echo Park Ave, LA, CA', lat: 34.0780, lng: -118.2550, city: 'Los Angeles', state: 'CA', createdBy: 'user-5' },
  { id: 'loc-25', name: 'Venice Co-Living', address: '555 Venice Blvd, Venice, CA', lat: 33.9920, lng: -118.4650, city: 'Venice', state: 'CA', createdBy: 'user-2' },
  { id: 'loc-26', name: 'Gjusta', address: 'Venice, CA', lat: 34.0010, lng: -118.4660, city: 'Venice', state: 'CA', createdBy: 'user-2' },
  { id: 'loc-27', name: 'Dinosaur Coffee', address: 'Silver Lake, CA', lat: 34.0870, lng: -118.2680, city: 'Los Angeles', state: 'CA', createdBy: 'user-3' },
  { id: 'loc-28', name: 'HomeState', address: 'Los Feliz, LA, CA', lat: 34.0910, lng: -118.2810, city: 'Los Angeles', state: 'CA', createdBy: 'user-4' },
  // Event locations
  { id: 'loc-30', name: 'Venice Beach', address: 'Venice Beach, CA', lat: 33.9850, lng: -118.4695, city: 'Venice', state: 'CA', createdBy: 'user-2' },
  { id: 'loc-31', name: 'Griffith Observatory', address: 'Griffith Observatory, LA', lat: 34.1185, lng: -118.3004, city: 'Los Angeles', state: 'CA', createdBy: 'user-4' },
  { id: 'loc-32', name: 'Dockweiler Beach', address: 'Dockweiler Beach, CA', lat: 33.9231, lng: -118.4360, city: 'Los Angeles', state: 'CA', createdBy: 'user-3' },
];

// ─── USERS ──────────────────────────────────────────────────────────────────
export const currentUser = {
  id: 'user-1',
  name: 'You',
  avatar: null,
  liveLocation: { lat: 34.0522, lng: -118.2437 },
  useLiveLocation: true,
  locationIds: ['loc-1'],
  currentLocationId: 'loc-1',
  bio: 'Explorer, community builder, lover of open spaces.',
  interests: ['hiking', 'co-working', 'van life', 'foraging'],
  reputation: 4.8,
  totalRatings: 47,
  tribes: ['tribe-1', 'tribe-2', 'tribe-3'],
  futureLocations: [
    { locationId: 'loc-9', date: '2026-03-01' },
    { locationId: 'loc-10', date: '2026-04-15' },
  ],
};

export const users = [
  currentUser,
  {
    id: 'user-2', name: 'Maya Chen', avatar: null,
    liveLocation: { lat: 34.0195, lng: -118.4912 },
    useLiveLocation: true,
    locationIds: ['loc-2'], currentLocationId: 'loc-2',
    bio: 'Digital nomad, yoga instructor, always looking for great coffee spots.',
    interests: ['yoga', 'surfing', 'co-working', 'cooking'],
    reputation: 4.9, totalRatings: 63, tribes: ['tribe-1', 'tribe-2'], distance: 8.2,
  },
  {
    id: 'user-3', name: 'Jake Rivera', avatar: null,
    liveLocation: { lat: 34.0736, lng: -118.2400 },
    useLiveLocation: true,
    locationIds: ['loc-3'], currentLocationId: 'loc-3',
    bio: 'Van lifer, rock climber, community organizer.',
    interests: ['climbing', 'van life', 'community events', 'photography'],
    reputation: 4.7, totalRatings: 38, tribes: ['tribe-1', 'tribe-3'], distance: 1.5,
  },
  {
    id: 'user-4', name: 'Aisha Patel', avatar: null,
    liveLocation: { lat: 34.1478, lng: -118.1445 },
    useLiveLocation: true,
    locationIds: ['loc-4'], currentLocationId: 'loc-4',
    bio: 'Freelance writer, tea lover, trail runner.',
    interests: ['writing', 'running', 'hiking', 'meditation'],
    reputation: 4.6, totalRatings: 29, tribes: ['tribe-1'], distance: 12.1,
  },
  {
    id: 'user-5', name: 'Sam Okonkwo', avatar: null,
    liveLocation: { lat: 33.9425, lng: -118.4081 },
    useLiveLocation: true,
    locationIds: ['loc-5'], currentLocationId: 'loc-5',
    bio: 'Musician, surfer, always down for an adventure.',
    interests: ['music', 'surfing', 'camping', 'foraging'],
    reputation: 4.5, totalRatings: 22, tribes: ['tribe-2', 'tribe-3'], distance: 14.3,
  },
  {
    id: 'user-6', name: 'Luna Martinez', avatar: null,
    liveLocation: { lat: 34.0259, lng: -118.3963 },
    useLiveLocation: true,
    locationIds: ['loc-6', 'loc-21', 'loc-23'], currentLocationId: 'loc-6',
    bio: 'Artist, herbalist, community garden enthusiast.',
    interests: ['art', 'gardening', 'herbalism', 'cooking'],
    reputation: 4.9, totalRatings: 51, tribes: ['tribe-1', 'tribe-2'], distance: 6.7,
  },
  {
    id: 'user-7', name: 'Eli Brooks', avatar: null,
    liveLocation: { lat: 37.7749, lng: -122.4194 },
    useLiveLocation: true,
    locationIds: ['loc-7'], currentLocationId: 'loc-7',
    bio: 'Tech worker turned nomad. Love hiking and board games.',
    interests: ['tech', 'hiking', 'board games', 'cooking'],
    reputation: 4.3, totalRatings: 15, tribes: ['tribe-1'], distance: 382,
  },
  {
    id: 'user-8', name: 'Priya Sharma', avatar: null,
    liveLocation: { lat: 34.0622, lng: -118.3537 },
    useLiveLocation: true,
    locationIds: ['loc-8'], currentLocationId: 'loc-8',
    bio: 'Dancer, foodie, looking for co-working spaces.',
    interests: ['dance', 'food', 'co-working', 'yoga'],
    reputation: 4.7, totalRatings: 33, tribes: ['tribe-2'], distance: 3.4,
  },
];

// ─── TRIBES ─────────────────────────────────────────────────────────────────
export const tribes = [
  {
    id: 'tribe-1', name: 'LA Nomads',
    description: 'Digital nomads and travelers in the LA area. Share spots, co-work, and explore together.',
    memberCount: 48, members: ['user-1', 'user-2', 'user-3', 'user-4', 'user-6', 'user-7'],
    owners: ['user-1'], admins: ['user-2'],
    joinLink: 'openfield.app/join/la-nomads', password: null, color: '#10b981',
  },
  {
    id: 'tribe-2', name: 'SoCal Surfers & Seekers',
    description: 'Surf, forage, camp, and connect with fellow ocean lovers across Southern California.',
    memberCount: 32, members: ['user-1', 'user-2', 'user-5', 'user-6', 'user-8'],
    owners: ['user-5'], admins: ['user-1'],
    joinLink: 'openfield.app/join/socal-surfers', password: 'waves2026', color: '#3b82f6',
  },
  {
    id: 'tribe-3', name: 'Van Life West Coast',
    description: 'Van dwellers sharing parking spots, resources, and adventures up and down the coast.',
    memberCount: 67, members: ['user-1', 'user-3', 'user-5'],
    owners: ['user-3'], admins: [],
    joinLink: 'openfield.app/join/vanlife-wc', password: null, color: '#f59e0b',
  },
  {
    id: 'tribe-4', name: 'Hiking & Trail Runners LA',
    description: 'Hit the trails around Los Angeles! Group hikes, trail runs, and outdoor fitness.',
    memberCount: 35, members: ['user-4', 'user-6', 'user-7'],
    owners: ['user-4'], admins: ['user-6'],
    joinLink: 'openfield.app/join/hiking-la', password: null, color: '#16a34a',
  },
  {
    id: 'tribe-5', name: 'Creative Collective',
    description: 'Artists, musicians, writers, and makers connecting for collaboration and inspiration.',
    memberCount: 22, members: ['user-5', 'user-8'],
    owners: ['user-5'], admins: [],
    joinLink: 'openfield.app/join/creative-collective', password: 'create2026', color: '#a855f7',
  },
  {
    id: 'tribe-6', name: 'Foodies & Foragers',
    description: 'Discover the best food spots, share recipes, and forage together in SoCal.',
    memberCount: 41, members: ['user-2', 'user-6', 'user-8'],
    owners: ['user-6'], admins: ['user-2'],
    joinLink: 'openfield.app/join/foodies-foragers', password: null, color: '#f97316',
  },
];

// ─── PLACES / SPACES ────────────────────────────────────────────────────────
// Each space is at a static location. Some can be "in use" by another user.
export const places = [
  { id: 'place-1', name: 'Echo Park Lake', type: 'park', locationId: 'loc-11', rating: 4.5, description: 'Great for morning walks, has free wifi nearby.', addedBy: 'user-3', inUseBy: null },
  { id: 'place-2', name: 'Groundwork Coffee', type: 'work', locationId: 'loc-12', rating: 4.7, description: 'Good wifi, plenty of outlets, $5 min purchase.', cost: '$', addedBy: 'user-2', inUseBy: null },
  { id: 'place-3', name: 'Venice Beach Lot', type: 'sleep', locationId: 'loc-13', rating: 3.8, description: 'Overnight parking tolerated. Best after 10pm.', cost: 'free', addedBy: 'user-5', inUseBy: null },
  { id: 'place-4', name: 'LA Fitness Sawtelle', type: 'shower', locationId: 'loc-14', rating: 4.2, description: 'Day pass $15, includes shower and locker.', cost: '$$', addedBy: 'user-6', inUseBy: null },
  { id: 'place-5', name: 'Griffith Park Trails', type: 'park', locationId: 'loc-15', rating: 4.9, description: 'Amazing trails with city views. Free parking before 10am.', addedBy: 'user-4', inUseBy: null },
  { id: 'place-6', name: 'The Last Bookstore', type: 'recommendation', locationId: 'loc-16', rating: 4.8, description: 'Must-visit bookstore in DTLA. Great for a rainy day.', addedBy: 'user-7', inUseBy: null },
  { id: 'place-7', name: 'Elysian Park Foraging', type: 'foraging', locationId: 'loc-17', rating: 4.1, description: 'Wild fennel, mustard greens, and prickly pear in season.', addedBy: 'user-3', inUseBy: null },
  { id: 'place-8', name: 'Mulholland Overlook', type: 'stealth-camping', locationId: 'loc-18', rating: 3.5, description: 'Quiet pullover spot. Leave by 6am. Van/car friendly.', addedBy: 'user-5', inUseBy: null },
  { id: 'place-9', name: 'WeWork Santa Monica', type: 'work', locationId: 'loc-19', rating: 4.4, description: 'Day passes available. Fast wifi.', cost: '$$', addedBy: 'user-2', inUseBy: null },
  { id: 'place-10', name: 'Community Kitchen DTLA', type: 'kitchen', locationId: 'loc-20', rating: 4.3, description: 'Shared kitchen space. $10/session.', cost: '$', addedBy: 'user-6', inUseBy: null },
  // Rooms, garages, yards, session spaces
  { id: 'place-11', name: 'Spare Room in Silver Lake', type: 'room', locationId: 'loc-21', rating: 4.6, description: 'Private room, shared bathroom. Quiet neighborhood. Available weekly.', cost: '$30/night', addedBy: 'user-6', inUseBy: 'user-4' },
  { id: 'place-12', name: 'Garage Workshop Space', type: 'garage', locationId: 'loc-22', rating: 4.3, description: '2-car garage with workbench, tools, and electricity. Great for projects.', cost: '$15/day', addedBy: 'user-3', inUseBy: null },
  { id: 'place-13', name: 'Backyard Garden Hangout', type: 'yard', locationId: 'loc-23', rating: 4.8, description: 'Big backyard with hammocks, fire pit, and outdoor kitchen. BBQ welcome!', cost: 'free', addedBy: 'user-6', inUseBy: null },
  { id: 'place-14', name: 'Echo Park Session Space', type: 'session-space', locationId: 'loc-24', rating: 4.5, description: 'Soundproofed room with basic instruments. Great for jam sessions or practice.', cost: '$20/hr', addedBy: 'user-5', inUseBy: null },
  { id: 'place-15', name: 'Venice Co-Living Room', type: 'room', locationId: 'loc-25', rating: 4.4, description: 'Shared room in co-living house. 5 min walk to beach. Includes kitchen access.', cost: '$25/night', addedBy: 'user-2', inUseBy: null },
  // Recommendations with Google links
  { id: 'place-16', name: 'Gjusta', type: 'restaurant', locationId: 'loc-26', rating: 4.9, description: 'Best bakery/deli in Venice. Amazing pastries and sandwiches.', addedBy: 'user-2', googleLink: 'https://maps.google.com/?cid=1234567890', inUseBy: null },
  { id: 'place-17', name: 'Dinosaur Coffee', type: 'cafe', locationId: 'loc-27', rating: 4.7, description: 'Cozy Silver Lake cafe. Great espresso and outdoor seating.', addedBy: 'user-3', googleLink: 'https://maps.google.com/?cid=9876543210', inUseBy: null },
  { id: 'place-18', name: 'HomeState', type: 'restaurant', locationId: 'loc-28', rating: 4.6, description: 'Texas-style breakfast tacos in Los Feliz. Worth the wait.', addedBy: 'user-4', googleLink: 'https://maps.google.com/?cid=1122334455', inUseBy: null },
];

// ─── VEHICLES ───────────────────────────────────────────────────────────────
// Each vehicle is at a static location OR borrowed by a user.
export const vehicles = [
  { id: 'vehicle-1', name: 'Honda Civic 2019', type: 'car', owner: 'user-3', available: true, cost: '$30/day', description: 'Reliable sedan, great on gas. 4 doors. Pickup in Echo Park.', locationId: 'loc-3', borrowedBy: null },
  { id: 'vehicle-2', name: 'Beach Cruiser Bike', type: 'bike', owner: 'user-2', available: true, cost: 'free', description: 'Single-speed cruiser, perfect for boardwalk rides. Includes lock.', locationId: 'loc-2', borrowedBy: null },
  { id: 'vehicle-3', name: 'VW Vanagon 1987', type: 'van', owner: 'user-5', available: false, cost: '$60/day', description: 'Classic camper van. Sleeps 2, has a small kitchen. Currently on a trip.', locationId: 'loc-5', borrowedBy: 'user-3' },
  { id: 'vehicle-4', name: 'Electric Scooter', type: 'scooter', owner: 'user-8', available: true, cost: '$10/day', description: 'Xiaomi e-scooter. 20mi range. Great for getting around the city.', locationId: 'loc-8', borrowedBy: null },
  { id: 'vehicle-5', name: 'Toyota Tacoma Pickup', type: 'truck', owner: 'user-3', available: true, cost: '$50/day', description: '4x4 pickup, great for hauling gear or weekend trips. Has a bed rack.', locationId: 'loc-3', borrowedBy: null },
];

// ─── GEAR ───────────────────────────────────────────────────────────────────
// Each gear item is at a static location OR borrowed by a user.
export const gear = [
  { id: 'gear-1', name: 'Camping Tent (4-person)', owner: 'user-3', available: true, cost: 'free', description: 'REI Half Dome, great condition.', locationId: 'loc-3', borrowedBy: null },
  { id: 'gear-2', name: 'Surfboard (longboard)', owner: 'user-5', available: true, cost: '$10/day', description: '9ft Wavestorm. Perfect for beginners.', locationId: 'loc-5', borrowedBy: null },
  { id: 'gear-3', name: 'Portable Solar Panel', owner: 'user-3', available: false, cost: 'free', description: 'Goal Zero Nomad 50. Currently in use.', locationId: 'loc-3', borrowedBy: 'user-5' },
  { id: 'gear-4', name: 'Climbing Harness + Shoes', owner: 'user-3', available: true, cost: 'free', description: 'Size M harness, size 10 shoes.', locationId: 'loc-3', borrowedBy: null },
  { id: 'gear-5', name: 'Camping Stove', owner: 'user-5', available: true, cost: 'free', description: 'MSR PocketRocket. Includes fuel canister.', locationId: 'loc-5', borrowedBy: null },
  { id: 'gear-6', name: 'Yoga Mat', owner: 'user-2', available: true, cost: 'free', description: 'Manduka PRO. Well-loved but functional.', locationId: 'loc-2', borrowedBy: null },
];

// ─── EVENTS ─────────────────────────────────────────────────────────────────
export const events = [
  { id: 'event-1', name: 'Sunset Yoga at Venice', date: '2026-02-14', time: '5:30 PM', locationId: 'loc-30', attendees: 12, tribe: 'tribe-2', host: 'user-2' },
  { id: 'event-2', name: 'Group Hike: Griffith Peak', date: '2026-02-15', time: '7:00 AM', locationId: 'loc-31', attendees: 8, tribe: 'tribe-1', host: 'user-4' },
  { id: 'event-3', name: 'Co-Working Wednesday', date: '2026-02-18', time: '10:00 AM', locationId: 'loc-12', attendees: 6, tribe: 'tribe-1', host: 'user-1' },
  { id: 'event-4', name: 'Van Meetup & Potluck', date: '2026-02-22', time: '4:00 PM', locationId: 'loc-32', attendees: 15, tribe: 'tribe-3', host: 'user-3' },
  { id: 'event-5', name: 'Foraging Walk', date: '2026-02-25', time: '9:00 AM', locationId: 'loc-17', attendees: 5, tribe: 'tribe-1', host: 'user-3' },
];

// ─── CALLOUTS ───────────────────────────────────────────────────────────────
export const callouts = [
  {
    id: 'callout-1', senderId: 'user-7', senderName: 'Eli Brooks',
    tribeId: 'tribe-1', tribeName: 'LA Nomads',
    location: { city: 'Los Angeles', state: 'CA' },
    message: "Hey everyone! I'm passing through LA this weekend. Anyone around to grab coffee or co-work?",
    createdAt: '2026-02-11T14:30:00',
    responses: [
      { userId: 'user-2', userName: 'Maya Chen', message: "Yes! I'm in Santa Monica. Let's meet up!", respondedAt: '2026-02-11T15:10:00' },
      { userId: 'user-3', userName: 'Jake Rivera', message: 'Down! Hit me up when you arrive.', respondedAt: '2026-02-11T16:45:00' },
    ],
  },
  {
    id: 'callout-2', senderId: 'user-1', senderName: 'You',
    tribeId: 'tribe-2', tribeName: 'SoCal Surfers & Seekers',
    location: { city: 'San Diego', state: 'CA' },
    message: 'Planning a surf trip to SD next month. Who will be around?',
    createdAt: '2026-02-10T09:00:00',
    responses: [
      { userId: 'user-5', userName: 'Sam Okonkwo', message: "I'll be there! Know some great breaks.", respondedAt: '2026-02-10T11:30:00' },
    ],
  },
  {
    id: 'callout-3', senderId: 'user-5', senderName: 'Sam Okonkwo',
    tribeId: 'tribe-3', tribeName: 'Van Life West Coast',
    location: { city: 'Big Sur', state: 'CA' },
    message: 'Heading up to Big Sur for the week! Anyone parked up there?',
    createdAt: '2026-02-09T18:00:00', responses: [],
  },
];

// ─── MESSAGES ───────────────────────────────────────────────────────────────
export const messages = [
  {
    id: 'thread-1', name: 'LA Nomads - Downtown Area',
    tribeId: 'tribe-1', type: 'group',
    radius: { lat: 34.0522, lng: -118.2437, miles: 10 },
    members: ['user-1', 'user-2', 'user-3', 'user-6', 'user-8'],
    messages: [
      { userId: 'user-3', userName: 'Jake Rivera', text: 'Anyone know a good parking spot near DTLA tonight?', time: '2026-02-11T20:30:00' },
      { userId: 'user-6', userName: 'Luna Martinez', text: 'Try the lot behind the Arts District. Usually quiet after 9pm.', time: '2026-02-11T20:45:00' },
      { userId: 'user-1', userName: 'You', text: 'I parked there last week, can confirm it works.', time: '2026-02-11T21:00:00' },
      { userId: 'user-8', userName: 'Priya Sharma', text: "Good to know! I'll check it out.", time: '2026-02-11T21:15:00' },
    ],
  },
  {
    id: 'thread-2', name: 'SoCal Surfers - Westside',
    tribeId: 'tribe-2', type: 'group',
    radius: { lat: 34.0195, lng: -118.4912, miles: 5 },
    members: ['user-1', 'user-2', 'user-5'],
    messages: [
      { userId: 'user-5', userName: 'Sam Okonkwo', text: 'Waves looking good tomorrow morning!', time: '2026-02-11T19:00:00' },
      { userId: 'user-2', userName: 'Maya Chen', text: "I'm in! Venice pier at 6:30?", time: '2026-02-11T19:20:00' },
      { userId: 'user-1', userName: 'You', text: 'Count me in.', time: '2026-02-11T19:45:00' },
    ],
  },
];

// ─── TYPE DEFINITIONS ───────────────────────────────────────────────────────
export const placeTypes = {
  park: { label: 'Parks', icon: 'Trees', color: '#10b981' },
  work: { label: 'Co-Working', icon: 'Laptop', color: '#3b82f6' },
  sleep: { label: 'Sleep Spots', icon: 'Moon', color: '#6366f1' },
  shower: { label: 'Showers', icon: 'Droplets', color: '#06b6d4' },
  kitchen: { label: 'Kitchens', icon: 'CookingPot', color: '#f97316' },
  foraging: { label: 'Foraging', icon: 'Leaf', color: '#22c55e' },
  'stealth-camping': { label: 'Stealth Camping', icon: 'Tent', color: '#8b5cf6' },
  recommendation: { label: 'Recommendations', icon: 'Star', color: '#eab308' },
  store: { label: 'Stores', icon: 'Store', color: '#ec4899' },
  restaurant: { label: 'Restaurants', icon: 'UtensilsCrossed', color: '#ef4444' },
  cafe: { label: 'Cafes', icon: 'Coffee', color: '#92400e' },
  room: { label: 'Rooms', icon: 'Home', color: '#7c3aed' },
  garage: { label: 'Garages', icon: 'Wrench', color: '#64748b' },
  yard: { label: 'Yards', icon: 'Flower2', color: '#16a34a' },
  'session-space': { label: 'Session Spaces', icon: 'Music', color: '#dc2626' },
};

export const vehicleTypes = {
  car: { label: 'Car', icon: 'Car', color: '#3b82f6' },
  van: { label: 'Van', icon: 'Bus', color: '#f59e0b' },
  bike: { label: 'Bike', icon: 'Bike', color: '#10b981' },
  scooter: { label: 'Scooter', icon: 'Zap', color: '#8b5cf6' },
  truck: { label: 'Truck', icon: 'Truck', color: '#64748b' },
};
