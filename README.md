# StayMatch

StayMatch is a student housing and roommate compatibility platform built with React, Express, MongoDB, JWT and Socket.IO. It supports student matching, approved property discovery, persistent favorites, reviews, connection requests, real-time-capable chats, owner listings, and administrator verification workflows.

## Run locally

1. Create `backend/.env` from `backend/.env.example` and set `MONGODB_URI` and a secure `JWT_SECRET`.
2. In `backend`, run `npm install`, then `npm run seed` (optional demo data), then `npm run dev`.
3. In `frontend`, run `npm install`, then `npm run dev`.

The frontend uses `http://localhost:5000/api/v1` by default. Set `VITE_API_BASE_URL` to override it.

## Demo accounts

All seeded accounts use password `DemoPass123!`:

- `student1@staymatch.demo` through `student5@staymatch.demo`
- `owner1@staymatch.demo`, `owner2@staymatch.demo`
- `admin@staymatch.demo`

## API groups

- `/api/v1/auth` — registration and login
- `/api/v1/users`, `/api/v1/profiles`, `/api/v1/lci` — profile and compatibility workflow
- `/api/v1/properties`, `/api/v1/favorites`, `/api/v1/reviews` — approved housing discovery and saved homes
- `/api/v1/connections`, `/api/v1/chats` — accepted connections and persistent messages
- `/api/v1/reports`, `/api/v1/admin` — moderation and administration

The LCI engine at `backend/src/modules/lci/lci.engine.js` is the single authoritative matching implementation. Stored questionnaire values are normalized there before scoring, and responses explain scores with matched factors and potential conflicts.

## Notes

Property and owner verification are intentional admin-reviewed workflows. Cloudinary variables are available for future upload configuration; no credentials are stored in the repository.
