# Product Requirements Document (PRD)
## Car Dealership Inventory System

| | |
|---|---|
| **Document Version** | 1.0 |
| **Date** | July 21, 2026 |
| **Author** | Het |
| **Status** | Draft |
| **Project Type** | TDD Kata / Portfolio Project |

---

## 1. Overview

### 1.1 Purpose
The Car Dealership Inventory System is a full-stack web application that allows a car dealership to manage its vehicle inventory, and allows customers/admins to browse, search, and purchase vehicles. The project is being built as a Test-Driven Development (TDD) kata to demonstrate proficiency in API design, database modeling, authentication, frontend engineering, and modern AI-assisted development workflows.

### 1.2 Goals
- Build a secure, RESTful backend API with persistent storage.
- Build a responsive, modern single-page frontend application.
- Demonstrate a clear Red-Green-Refactor TDD workflow with meaningful test coverage.
- Produce professional-grade documentation, including transparent AI usage disclosure.

### 1.3 Non-Goals
- Payment processing / real financial transactions (purchases are simulated by decrementing stock quantity).
- Multi-tenant support (single dealership instance only).
- Mobile native applications (web-responsive only).

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (SPA), HTML5, CSS3, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (via Mongoose ODM) |
| Authentication | JWT (JSON Web Tokens), bcrypt for password hashing |
| Testing | Jest, Supertest |
| Version Control | Git / GitHub |
| AI Tooling | Disclosed per-commit (Co-authored-by trailer) + `PROMPTS.md` log |

This is the classic **MERN stack** (MongoDB, Express, React, Node.js), styled with Tailwind CSS.

---

## 3. System Architecture

### 3.1 High-Level Architecture
A decoupled client-server architecture:
- **Frontend (React SPA)** communicates with the backend exclusively via a versioned REST API (`/api/...`), using an HTTP client (e.g., Axios or fetch) with a JWT attached via an `Authorization: Bearer <token>` header for protected routes.
- **Backend (Express API)** exposes REST endpoints, applies authentication/authorization middleware, executes business logic in a service layer, and persists data via Mongoose models to MongoDB.
- **Database (MongoDB)** stores `User` and `Vehicle` collections.

```
┌─────────────────┐        HTTPS/REST (JWT)        ┌──────────────────┐        Mongoose        ┌───────────┐
│  React Frontend │ ──────────────────────────────▶ │   Express API     │ ─────────────────────▶ │  MongoDB  │
│  (Tailwind CSS) │ ◀────────────────────────────── │  (Node.js)        │ ◀───────────────────── │           │
└─────────────────┘                                 └──────────────────┘                         └───────────┘
```

### 3.2 Backend Folder Structure
```
car-dealership-api/
├── node_modules/
├── src/
│   ├── config/             # Configuration files (database connection, env variables)
│   │   └── db.js
│   ├── controllers/        # Handle HTTP requests and responses
│   │   ├── authController.js
│   │   ├── vehicleController.js
│   │   └── purchaseController.js
│   ├── middlewares/        # Custom Express middlewares
│   │   ├── authMiddleware.js   # JWT verification
│   │   └── roleMiddleware.js   # Admin checks
│   ├── models/              # Database schemas/queries (Data Access Layer)
│   │   ├── userModel.js
│   │   ├── vehicleModel.js
│   │   └── purchaseModel.js
│   ├── routes/              # Map URL endpoints to controllers
│   │   ├── authRoutes.js
│   │   ├── vehicleRoutes.js
│   │   └── purchaseRoutes.js
│   ├── services/            # Core business logic (The "brain")
│   │   ├── authService.js
│   │   └── inventoryService.js   # Handles purchase/restock logic + purchase history queries
│   ├── app.js               # Express app setup (middlewares, route registration)
│   └── server.js            # Entry point (listens on PORT)
├── tests/                   # All Jest test files
│   ├── integration/         # Supertest endpoint testing
│   │   ├── auth.test.js
│   │   ├── vehicles.test.js
│   │   └── purchases.test.js
│   └── unit/                # Testing isolated services/models
│       └── inventoryService.test.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── PROMPTS.md
└── README.md
```

**Layer responsibilities:**
- `routes/` — pure URL → controller mapping, no logic.
- `controllers/` — parse request, call service, shape response, handle HTTP status codes.
- `services/` — business rules (e.g., stock validation, purchase logic, password hashing orchestration). Framework-agnostic where possible, easing unit testing.
- `models/` — Mongoose schemas and data-access methods only.
- `middlewares/` — cross-cutting concerns (JWT verification, role checks, error handling).

### 3.3 Frontend Folder Structure (proposed)
```
car-dealership-client/
├── public/
├── src/
│   ├── api/                # Axios instance + API call wrappers
│   │   ├── authApi.js
│   │   └── vehicleApi.js
│   ├── components/          # Reusable UI components
│   │   ├── VehicleCard.jsx
│   │   ├── SearchFilterBar.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/              # Auth context/provider (JWT + user state)
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── AdminPage.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css            # Tailwind directives
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization
| ID | Requirement |
|---|---|
| FR-1 | Users can register with name, email, and password. Passwords are hashed (bcrypt) before storage. |
| FR-2 | Users can log in with email/password and receive a signed JWT. |
| FR-3 | JWT must be required (via middleware) on all `/api/vehicles*` routes. |
| FR-4 | Users have a `role` field (`customer` or `admin`); admin-only actions are enforced via role middleware. |
| FR-5 | Invalid/expired tokens return `401 Unauthorized`; insufficient role returns `403 Forbidden`. |

### 4.2 Vehicle Management
| ID | Requirement |
|---|---|
| FR-6 | Any authenticated user can view all vehicles (`GET /api/vehicles`). |
| FR-7 | Any authenticated user can search/filter vehicles by make, model, category, or price range (`GET /api/vehicles/search`). |
| FR-8 | Authenticated users (role TBD — see Open Questions) can add a new vehicle (`POST /api/vehicles`). |
| FR-9 | Authenticated users can update vehicle details (`PUT /api/vehicles/:id`). |
| FR-10 | Only admins can delete a vehicle (`DELETE /api/vehicles/:id`). |
| FR-11 | Each vehicle has: unique ID, make, model, category, price, quantity in stock, and timestamps. |

### 4.3 Inventory / Purchasing
| ID | Requirement |
|---|---|
| FR-12 | Authenticated users can purchase a vehicle (`POST /api/vehicles/:id/purchase`), decrementing quantity by 1 and creating a corresponding Purchase record (see Section 4.4). |
| FR-13 | Purchase must fail with a clear error (e.g., `400 Bad Request`) if quantity is already 0. |
| FR-14 | Only admins can restock a vehicle (`POST /api/vehicles/:id/restock`), increasing quantity by a specified amount. |

### 4.4 Purchase History
| ID | Requirement |
|---|---|
| FR-15 | Every purchase is recorded as its own record (not just a stock decrement), capturing which user bought which vehicle, at what price, and when. |
| FR-16 | An authenticated user can retrieve their own purchase history (`GET /api/purchases/me`), most recent first. |
| FR-17 | An admin can retrieve the full purchase history across all users (`GET /api/purchases`), with optional filtering (e.g., by user, vehicle, or date range). |
| FR-18 | A single purchase record can be retrieved by ID (`GET /api/purchases/:id`) — the owning user or an admin only. |

### 4.5 Frontend
| ID | Requirement |
|---|---|
| FR-19 | Registration and login forms with client-side validation and error display. |
| FR-20 | Dashboard/homepage listing all available vehicles as cards (make, model, category, price, stock). |
| FR-21 | Search/filter UI bound to the backend search endpoint. |
| FR-22 | "Purchase" button per vehicle card; disabled and visually distinct when quantity is 0. |
| FR-23 | Admin-only views/forms to add, update, and delete vehicles, hidden from non-admin users. |
| FR-24 | Responsive layout (mobile, tablet, desktop) styled with Tailwind CSS. |
| FR-25 | A "My Purchases" page for regular users, listing their own purchase history (vehicle, price paid, date). |
| FR-26 | An admin-only "All Purchases" page listing every purchase across all users, with filter/search support. |

---

## 5. Data Models

### 5.1 User
```js
{
  _id: ObjectId,
  name: String,          // required
  email: String,         // required, unique
  password: String,      // required, hashed
  role: String,          // enum: ["customer", "admin"], default: "customer"
  createdAt: Date,
  updatedAt: Date
}
```

### 5.2 Vehicle
```js
{
  _id: ObjectId,
  make: String,           // required
  model: String,          // required
  category: String,       // e.g., "Sedan", "SUV", "Truck"
  price: Number,           // required
  quantity: Number,        // required, default: 0
  createdAt: Date,
  updatedAt: Date
}
```

### 5.3 Purchase
```js
{
  _id: ObjectId,
  user: ObjectId,          // required, ref: "User" — who made the purchase
  vehicle: ObjectId,       // required, ref: "Vehicle" — which vehicle was bought
  quantity: Number,        // required, default: 1
  pricePerUnit: Number,    // required — snapshot of the vehicle's price at purchase time
  totalPrice: Number,      // required — pricePerUnit * quantity
  purchasedAt: Date,       // required, default: Date.now
  createdAt: Date,
  updatedAt: Date
}
```
Storing `pricePerUnit`/`totalPrice` as a snapshot (rather than re-reading the vehicle's current price) keeps historical purchase records accurate even if the vehicle's price changes later. `user` and `vehicle` should be indexed to make "my history" and "history for this vehicle" queries efficient.

---

## 6. API Specification

| Method | Endpoint | Auth Required | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | — | Register a new user |
| POST | `/api/auth/login` | No | — | Log in, receive JWT |
| GET | `/api/vehicles` | Yes | Any | List all vehicles |
| GET | `/api/vehicles/search` | Yes | Any | Search/filter vehicles (query params: `make`, `model`, `category`, `minPrice`, `maxPrice`) |
| POST | `/api/vehicles` | Yes | Admin | Add a new vehicle |
| PUT | `/api/vehicles/:id` | Yes | Admin | Update vehicle details |
| DELETE | `/api/vehicles/:id` | Yes | Admin | Delete a vehicle |
| POST | `/api/vehicles/:id/purchase` | Yes | Any | Purchase (decrement quantity, creates a Purchase record) |
| POST | `/api/vehicles/:id/restock` | Yes | Admin | Restock (increment quantity) |
| GET | `/api/purchases/me` | Yes | Any | Get the logged-in user's own purchase history |
| GET | `/api/purchases` | Yes | Admin | Get purchase history across all users (optional filters: `user`, `vehicle`, `from`, `to`) |
| GET | `/api/purchases/:id` | Yes | Owner or Admin | Get a single purchase record by ID |

**Standard error format:**
```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

---

## 7. Testing Strategy (TDD)

- **Workflow:** Red → Green → Refactor for every service/controller method, visible in commit history.
- **Unit tests** (`tests/unit/`): isolate services (e.g., `inventoryService`) and models using mocks/stubs — no real DB or HTTP layer.
- **Integration tests** (`tests/integration/`): use Supertest against the Express app with a test database (e.g., `mongodb-memory-server` or a dedicated test MongoDB instance) to validate full request/response cycles, auth flows, and role enforcement.
- **Coverage target:** meaningful coverage of business-critical paths — auth, purchase/restock stock boundaries, and role-guarded routes — reported via Jest's `--coverage` flag.
- **Test report:** exported/summarized in the README as required by the kata deliverables.

---

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Security | Passwords hashed with bcrypt; JWT secret stored in `.env`, never committed; `.env.example` provided |
| Code Quality | SOLID principles, clear naming, meaningful comments, layered architecture (routes → controllers → services → models) |
| Documentation | README with setup instructions, screenshots, "My AI Usage" section, test report |
| AI Transparency | Every AI-assisted commit includes a `Co-authored-by` trailer; full prompt history logged in `PROMPTS.md` |
| Version Control | Frequent, descriptive commits narrating the TDD journey |
| Responsiveness | UI functions across mobile, tablet, and desktop breakpoints |

---

## 9. Deliverables Checklist

- [ ] Public Git repository (backend + frontend)
- [ ] Backend: Node.js/Express + MongoDB, JWT auth, all specified endpoints
- [ ] Frontend: React + Tailwind CSS SPA covering all specified functionality
- [ ] Jest + Supertest test suites (unit + integration) with visible Red-Green-Refactor commit history
- [ ] `README.md` — project explanation, setup instructions (backend + frontend), screenshots, "My AI Usage" section, test report
- [ ] `PROMPTS.md` — full AI chat/prompt history
- [ ] `.env.example` committed; `.env` gitignored
- [ ] (Optional) Live deployment link (e.g., Vercel/Netlify for frontend, Render/Railway/Heroku for backend)

---

## 10. Open Questions

1. Should **adding** a vehicle (`POST /api/vehicles`) be restricted to admins, or open to any authenticated user? The kata doesn't explicitly mark it "Admin only" (unlike delete/restock), so this needs a decision before implementation.
2. Should `purchase` reduce quantity by exactly 1 per request, or support a `quantity` field in the request body for bulk purchase?
3. Deployment targets for the optional "brownie points" live demo (e.g., Vercel for frontend, Render/Railway for backend + MongoDB Atlas for the database)?
4. If a vehicle is later deleted (`DELETE /api/vehicles/:id`), should its past Purchase records be kept (for historical accuracy) even though the vehicle no longer exists? Recommended: keep them, and store a denormalized snapshot of make/model/category on the Purchase record so history still displays correctly after deletion.
5. Should purchase history endpoints support pagination (e.g., `page`/`limit` query params) given they could grow large over time?

---

## 11. Milestones (Suggested)

| Phase | Scope |
|---|---|
| 1 | Project scaffolding, DB connection, `.env` setup, User model + auth (register/login) with tests |
| 2 | Vehicle model + CRUD endpoints with tests |
| 3 | Purchase/restock logic + role middleware with tests |
| 4 | Purchase model + purchase history endpoints (`/me`, all-history, by ID) with tests |
| 5 | Frontend scaffolding (React + Tailwind), auth pages, protected routing |
| 6 | Frontend dashboard, search/filter UI, purchase flow |
| 7 | Admin UI (add/update/delete vehicles) |
| 8 | "My Purchases" page (user) + "All Purchases" page (admin) |
| 9 | README, screenshots, test report, `PROMPTS.md`, AI usage write-up |
| 10 | (Optional) Deployment |