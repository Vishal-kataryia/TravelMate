# TravelMate — Travel Together, Travel Better

Student/resume full-stack travel booking prototype. Book a journey, find compatible
travel companions (backend matching), pick a seat, and manage bookings. All free,
beginner-friendly technologies.

## Features
- Home with hero + travel search form + popular destinations + why cards
- About, Services, Our Work, Contact pages
- Register/Login with JWT + bcryptjs, protected routes, profile update
- Travel search, backend traveler matching with deterministic score (50+20+15+15=100)
- Visual seat selection with booked-seat protection
- Booking confirm/success, My Bookings with cancel (seat freed), contact saved to MongoDB
- Responsive + accessible UI, Lucide icons, no paid APIs

## Technologies
Frontend: React, Vite, JavaScript, CSS, React Router, Axios, Lucide React
Backend: Node.js, Express.js, JavaScript
Database: MongoDB Community Server + Mongoose
Auth: JWT + bcryptjs

## Requirements
- Node.js 18+
- MongoDB Community Server (local)

## MongoDB installation (Windows)
1. Download MongoDB Community Server from mongodb.com and install (default options, install as Service).
2. Start it: Services app → MongoDB Server → Running. Or run `mongod` from an admin terminal.
3. Verify: `mongosh --eval "db.runCommand({ping:1})"` should return `{ ok: 1 }`.
4. App uses `mongodb://127.0.0.1:27017/travelmate` (see `server/.env`).
5. If MongoDB is not running the backend exits with: `MongoDB connection failed. Please make sure MongoDB is running.`

## Project structure
- `client/` — React + Vite frontend (pages, components, context, services)
- `server/` — Express API (config, models, controllers, routes, middleware, seed)
- Key models: User, Travel, Booking, Contact

## Environment variables
Copy `server/.env.example` to `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/travelmate
JWT_SECRET=change_this_secret
CLIENT_URL=http://localhost:5173
```
`.env` is gitignored. Frontend optionally uses `VITE_API_URL` (see `client/.env.example`).

## Installation
Backend:
```bash
cd server
npm install
npm run dev
```
Frontend:
```bash
cd client
npm install
npm run dev
```

## Database seeding
```bash
cd server
npm run seed
```
Creates demo users (Rahul, Priya, Amit, Neha, Arjun, Anjali, Rohit, Sneha),
journeys (Delhi→Goa, Delhi→Jaipur, Delhi→Manali, Mumbai→Goa, Delhi→Kerala, Delhi→Mumbai),
and 2 demo bookings (A1, A2 booked on Delhi→Goa).

## Running
- Backend: `cd server && npm run dev` → http://localhost:5000
- Frontend: `cd client && npm run dev` → http://localhost:5173

## Demo credentials
Email: `demo@travelmate.com` / Password: `Demo@123` (password stored hashed; created by seed).

## API endpoints
Auth: POST /api/auth/register, POST /api/auth/login, GET /api/auth/profile, PUT /api/auth/profile
Travel: GET /api/travels, GET /api/travels/:id, GET /api/travels/search
Matching: GET /api/matching
Booking: POST /api/bookings, GET /api/bookings/my-bookings, GET /api/bookings/:id, PUT /api/bookings/:id/cancel
Contact: POST /api/contact

## Matching logic
Backend only, deterministic. Destination must match (50 pts) + same travel date (20 pts).
Food/seat: same food = compatible; veg + "Vegetarian Only" blocks non-veg travelers;
veg + "Non-Vegetarian Allowed" permits non-veg (score 90–95). Different destination or
date = no match. Reasons shown (same destination/date/food/seating).

## Common errors
- `MongoDB connection failed` → start MongoDB service.
- `Unable to connect to the server` → backend not running on :5000.
- `This seat is already booked` → someone booked it first; pick another seat.
- `Please login before continuing` → login, then retry booking.

## Future improvements
- Real payment, email/SMS notifications, ratings, group chat, admin dashboard, Atlas deploy.
