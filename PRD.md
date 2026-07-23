# Product Requirements Document (PRD)
## Car Dealership Inventory System

| | |
|---|---|
| **Document Version** | 1.1 |
| **Date** | July 23, 2026 |
| **Author** | Het |
| **Status** | Active / Completed |
| **Project Type** | TDD Kata  |

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
| Frontend | React (SPA), HTML5, CSS3, Tailwind CSS, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB (via Mongoose ODM) |
| Image Hosting| Cloudinary |
| Authentication | JWT (JSON Web Tokens), bcrypt for password hashing |
| Testing | Jest, Supertest, React Testing Library |
| Version Control | Git / GitHub |
| AI Tooling | Disclosed per-commit (Co-authored-by trailer) + `PROMPTS.md` log |
| Deployment | Vercel (Frontend), Render (Backend), MongoDB Atlas |

This is the classic **MERN stack** (MongoDB, Express, React, Node.js), styled with Tailwind CSS.

---

## 3. System Architecture

### 3.1 High-Level Architecture
A decoupled client-server architecture:
- **Frontend (React SPA)** communicates with the backend exclusively via a versioned REST API (`/api/...`), using Axios with a JWT attached via an `Authorization: Bearer <token>` header for protected routes.
- **Backend (Express API)** exposes REST endpoints, applies authentication/authorization middleware, executes business logic in a service layer, and persists data via Mongoose models to MongoDB.
- **Database (MongoDB)** stores `User`, `Vehicle`, `Purchase`, and `Ticket` collections.
- **Cloudinary** is used as an external service to host vehicle images.

```
┌─────────────────┐        HTTPS/REST (JWT)        ┌──────────────────┐        Mongoose        ┌───────────┐
│  React Frontend │ ──────────────────────────────▶ │   Express API     │ ─────────────────────▶ │  MongoDB  │
│  (Tailwind CSS) │ ◀────────────────────────────── │  (Node.js)        │ ◀───────────────────── │           │
└─────────────────┘                                 └──────────────────┘                         └───────────┘
                                                             │
                                                             ▼
                                                      ┌────────────┐
                                                      │ Cloudinary │
                                                      └────────────┘
```

### 3.2 Backend Folder Structure
```
car-inventory-system/Backend/
├── src/
│   ├── config/             # DB connection, Cloudinary config
│   ├── controllers/        # Route logic
│   ├── middlewares/        # Auth, Role, Upload middlewares
│   ├── models/             # Mongoose Schemas (User, Vehicle, Purchase, Ticket)
│   ├── routes/             # Express Routers
│   ├── services/           # Core business logic
│   ├── app.js              # Express app setup and CORS
│   └── server.js           # Server listener
├── tests/                  # Jest tests
├── .env
├── package.json
```

### 3.3 Frontend Folder Structure
```
car-inventory-system/Frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI (CarCard, DashboardLayout, etc.)
│   ├── context/            # Auth context provider
│   ├── pages/              # Main route views (Home, AdminDashboard, PurchaseHistory, Support)
│   ├── services/           # Axios interceptors and API wrappers
│   ├── App.jsx             # Router definition
│   └── index.css           # Global styles + Tailwind
├── tailwind.config.js
├── vite.config.js
├── .env
├── package.json
```

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization
| ID | Requirement |
|---|---|
| FR-1 | Users can register with name, email, and password. Passwords are hashed (bcrypt) before storage. |
| FR-2 | Users can log in with email/password and receive a signed JWT. |
| FR-3 | JWT must be required (via middleware) on protected routes. |
| FR-4 | Users have a `role` field (`customer` or `admin`); admin-only actions are enforced via role middleware. |
| FR-5 | Invalid/expired tokens return `401 Unauthorized`; insufficient role returns `403 Forbidden`. |

### 4.2 Vehicle Management
| ID | Requirement |
|---|---|
| FR-6 | Any authenticated user can view all vehicles (`GET /api/vehicles`). |
| FR-7 | Any authenticated user can search/filter vehicles by make, model, category, or price range. |
| FR-8 | Admins can add a new vehicle with an image uploaded to Cloudinary (`POST /api/vehicles`). |
| FR-9 | Admins can update vehicle details (`PUT /api/vehicles/:id`). |
| FR-10 | Only admins can delete a vehicle (`DELETE /api/vehicles/:id`). |
| FR-11 | Each vehicle has: make, model, category, price, quantity, and an `imageUrl`. |

### 4.3 Inventory / Purchasing
| ID | Requirement |
|---|---|
| FR-12 | Authenticated users can purchase a vehicle (`POST /api/vehicles/:id/purchase`), decrementing quantity by 1. |
| FR-13 | Purchase must fail with a clear error if quantity is already 0. |
| FR-14 | Only admins can restock a vehicle (`POST /api/vehicles/:id/restock`), increasing quantity by a specified amount. |

### 4.4 Purchase History
| ID | Requirement |
|---|---|
| FR-15 | Every purchase is recorded as its own record, capturing user, vehicle, price snapshot, and date. |
| FR-16 | Users can retrieve their own purchase history (`GET /api/purchases/me`). |
| FR-17 | Admins can retrieve the full purchase history across all users (`GET /api/purchases`). |

### 4.5 Frontend UI
| ID | Requirement |
|---|---|
| FR-18 | Dashboard layout with a left sidebar for navigation and top bar for user profile/search. |
| FR-19 | Dashboard/homepage listing all available vehicles as styled cards. Currency localized to INR (₹). |
| FR-20 | "Purchase" button per vehicle card; disabled and styled differently (grayscale) when quantity is 0 ("Sold Out"). |
| FR-21 | Admin Dashboard to manage fleet: add/edit forms, restock, delete capabilities with total stock value calculations. |
| FR-22 | "My Purchases" page listing user's purchase history in a responsive table. |

### 4.6 Support & Tickets
| ID | Requirement |
|---|---|
| FR-23 | Authenticated users can create support tickets (`POST /api/tickets`) with a subject and message. |
| FR-24 | Authenticated users can view their own tickets (`GET /api/tickets`). |
| FR-25 | Admins can view all tickets (`GET /api/tickets`). |
| FR-26 | Admins can resolve tickets and provide an `adminResponse` (`PUT /api/tickets/:id/resolve`). |

---

## 5. Data Models

### 5.1 User
```js
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: String,          // ["customer", "admin"]
  createdAt: Date,
  updatedAt: Date
}
```

### 5.2 Vehicle
```js
{
  _id: ObjectId,
  make: String,
  model: String,
  category: String,
  price: Number,
  quantity: Number,
  imageUrl: String,      // Cloudinary image URL
  createdAt: Date,
  updatedAt: Date
}
```

### 5.3 Purchase
```js
{
  _id: ObjectId,
  user: ObjectId,          // ref: "User"
  vehicle: ObjectId,       // ref: "Vehicle"
  quantity: Number,
  purchasePrice: Number,   // Snapshot of price
  purchaseDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 5.4 Ticket
```js
{
  _id: ObjectId,
  user: ObjectId,          // ref: "User"
  subject: String,
  message: String,
  status: String,          // ["Open", "Resolved"]
  adminResponse: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 6. API Specification

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | — | Register a new user |
| POST | `/api/auth/login` | No | — | Log in, receive JWT |
| GET | `/api/vehicles` | Yes | Any | List all vehicles |
| GET | `/api/vehicles/search` | Yes | Any | Search/filter vehicles |
| POST | `/api/vehicles` | Yes | Admin | Add a new vehicle |
| PUT | `/api/vehicles/:id` | Yes | Admin | Update vehicle details |
| DELETE | `/api/vehicles/:id` | Yes | Admin | Delete a vehicle |
| POST | `/api/vehicles/:id/purchase` | Yes | Any | Purchase a vehicle |
| POST | `/api/vehicles/:id/restock` | Yes | Admin | Restock a vehicle |
| POST | `/api/upload` | Yes | Admin | Upload an image to Cloudinary |
| GET | `/api/purchases/me` | Yes | Any | Get logged-in user's purchase history |
| GET | `/api/purchases` | Yes | Admin | Get all purchases |
| GET | `/api/tickets` | Yes | Any | Get tickets (user sees own, admin sees all) |
| POST | `/api/tickets` | Yes | Any | Create a new ticket |
| PUT | `/api/tickets/:id/resolve` | Yes | Admin | Resolve a ticket and add response |

---

## 7. Delivery & Milestones

All milestones for the initial requirements and bonus features have been successfully completed:

- [x] Backend API scaffolding & DB Connection
- [x] Auth & User endpoints (JWT)
- [x] Vehicle CRUD operations
- [x] Cloudinary Image Upload integration
- [x] Purchase & Restock core logic
- [x] Support Ticket System
- [x] Frontend React + Tailwind scaffolding
- [x] Dashboard UI with Search, Filters, and "Sold Out" states
- [x] Admin UI with complete inventory management
- [x] "Purchase History" & "Support" pages
- [x] UI Currency localized to INR (₹)
- [x] Full deployment configuration (Vercel + Render)

---

## 8. Resolved Architecture Decisions

1. **Adding Vehicles:** Restricted strictly to Admin users, enforced by Role Middleware and Admin Dashboard UI.
2. **Purchase Quantity:** Handled as single-unit purchases per click in the frontend flow.
3. **Deployment Targets:** 
   - **Frontend:** Vercel (Configured with Vite)
   - **Backend:** Render (Web Service, auto-configured with Node/Express)
   - **Database:** MongoDB Atlas (IP whitelisting configured for 0.0.0.0/0)
4. **Historical Purchase Accuracy:** The `Purchase` model records a snapshot of the vehicle's `purchasePrice` at the exact time of transaction, preventing historical records from being altered if a vehicle's price is updated later.
5. **Currency Display:** Converted to INR (₹) across the frontend instead of USD ($).