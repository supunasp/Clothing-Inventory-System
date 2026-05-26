# Clothing Inventory System

A full-stack MERN application for managing a clothing retailer's product
catalogue and stock levels. Built for **Assessment 1 — Software Requirements
Analysis and Design** (Full-Stack CRUD Application Development with DevOps
Practices).

The MVP supports two user types — **Staff** and **Admin** — and extends the
provided [starter project](https://github.com/nahaQUT/sampleapp_IFQ636.git) with
domain-specific CRUD, an inventory audit trail, an admin panel, and an automated
release-and-deploy pipeline.

---

## Tech Stack

**Backend**

- Node.js 20 + Express 4
- MongoDB with Mongoose 6
- JWT authentication, bcrypt password hashing
- Winston logging
- Mocha + Chai + Sinon + `mongodb-memory-server` for tests

**Frontend**

- React 18 + React Router 6
- Tailwind CSS 3
- Axios for HTTP, `lucide-react` for icons
- Create React App (`react-scripts` 5)

**DevOps**

- GitHub Actions for CI (tests + build) and release/deploy
- Self-hosted runner on EC2, `pm2` for the backend process
- Conventional version bumps via `npm version patch` on every push to `main`

---

## Features

### Staff
- Register, log in, manage own profile (with session-timeout handling)
- Browse the product dashboard with filters and pagination
- Create products and product variants (SKU + colour + size)
- Adjust stock with a logged increase/decrease audit entry

### Admin (in addition to Staff)
- Manage categories and brands
- Manage users — change status (active/inactive), change role, delete
- View analytics and low-stock products
- View the full inventory audit history
- Open detailed admin product views and toggle product status

---

## Project Structure

```
.
├── backend/                  Express API
│   ├── config/db.js          Mongo connection
│   ├── controllers/          Route handlers
│   ├── middleware/           protect + adminOnly
│   ├── models/               Mongoose schemas
│   ├── routes/               Auth, products, variants, categories, brands, audits, admin
│   ├── test/                 Mocha specs (in-memory Mongo)
│   └── server.js
├── frontend/                 React SPA
│   └── src/
│       ├── components/       layout/ + common/ (modals, pagination, filters)
│       ├── context/          AuthContext
│       ├── hooks/            useReferenceData, useSessionTimeout
│       ├── pages/            Login, Register, Dashboard, admin pages, etc.
│       └── App.js            Routes + role-protected layouts
├── .github/workflows/
│   ├── ci.yml                Test backend + build frontend on PR/push
│   └── release-and-deploy.yml Tag patch release + deploy to EC2
└── package.json              Top-level scripts (concurrently runs both)
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- A MongoDB connection string (Atlas or local)

### Install

```bash
npm run install-all
```

This installs root, backend, and frontend dependencies.

### Configure

Copy `backend/.env.example` to `backend/.env` and fill in:

```env
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<a long random secret>
PORT=5001
```

### Run

```bash
# Development (nodemon + react-scripts, both watch for changes)
npm run dev

# Production-style local run
npm start
```

- Backend: http://localhost:5001
- Frontend: http://localhost:3000
- Health check: `GET /api/health`

### Test

```bash
cd backend
npm test
```

Tests use `mongodb-memory-server`, so no external Mongo is required.

---

## API Overview

All endpoints below are prefixed with `/api`. Routes marked **(admin)** require
an admin JWT; all others require any authenticated user unless noted.

| Method | Path                              | Purpose                                  |
| ------ | --------------------------------- | ---------------------------------------- |
| GET    | `/health`                         | Liveness + current version (public)      |
| POST   | `/auth/register`                  | Create a new staff account (public)      |
| POST   | `/auth/login`                     | Issue a JWT (public)                     |
| GET    | `/auth/profile`                   | Get current user                         |
| PUT    | `/auth/profile`                   | Update current user                      |
| GET    | `/categories`                     | List categories                          |
| POST   | `/categories`                     | Create category **(admin)**              |
| PUT    | `/categories/:categoryId`         | Update category **(admin)**              |
| DELETE | `/categories/:categoryId`         | Delete category **(admin)**              |
| GET    | `/brands`                         | List brands                              |
| POST   | `/brands`                         | Create brand **(admin)**                 |
| PUT    | `/brands/:brandId`                | Update brand **(admin)**                 |
| DELETE | `/brands/:brandId`                | Delete brand **(admin)**                 |
| GET    | `/products`                       | List products                            |
| POST   | `/products`                       | Create product                           |
| GET    | `/products/:productId`            | Get product                              |
| PUT    | `/products/:productId`            | Update product                           |
| PATCH  | `/products/:productId/status`     | Activate/deactivate product **(admin)**  |
| DELETE | `/products/:productId`            | Delete product                           |
| GET    | `/products/variants`              | List variants                            |
| POST   | `/products/variants`              | Create variant                           |
| GET    | `/products/variants/:sku`         | Get variant                              |
| PUT    | `/products/variants/:sku`         | Update variant                           |
| POST   | `/products/variants/:sku/inventory` | Adjust stock (logs an audit entry)     |
| DELETE | `/products/variants/:sku`         | Delete variant                           |
| GET    | `/inventory-audits`               | List audit entries **(admin)**           |
| GET    | `/admin/analytics`                | Dashboard analytics **(admin)**          |
| GET    | `/admin/low-stock`                | Low-stock variants **(admin)**           |
| GET    | `/admin/users`                    | List users **(admin)**                   |
| PUT    | `/admin/users/:id/status`         | Activate/deactivate user **(admin)**     |
| PUT    | `/admin/users/:id/role`           | Change user role **(admin)**             |
| DELETE | `/admin/users/:id`                | Delete user **(admin)**                  |

---

## Data Model

- **User** — `firstName`, `lastName`, `email`, `password` (bcrypt-hashed), `active`, `role` (`admin` | `staff`)
- **ProductCategory** — `categoryId`, `categoryName`
- **ProductBrand** — `brandId`, `brandName`
- **Product** — `productId`, `name`, `description`, `category`, `brand`, `active`
- **ProductVariant** — `sku`, `color`, `size`, `stockAmount`, `product`
- **InventoryAudit** — `productVariant`, `sku`, `type` (`increase` | `decrease`), `amount`, `quantityBefore`, `quantityAfter`, `reference`, `updatedBy`

---

## CI/CD

- **`.github/workflows/ci.yml`** — runs on every push and PR to `main`. Installs
  and tests the backend, installs and builds the frontend.
- **`.github/workflows/release-and-deploy.yml`** — runs on push to `main`
  (skipping its own release commits):
  1. Re-runs backend tests.
  2. Bumps the root `package.json` patch version and pushes a `vX.Y.Z` tag.
  3. Deploys to EC2 via a self-hosted runner — checks out the new tag, installs
     production deps, symlinks `BACKEND_ENV_FILE` as `.env`, and reloads the
     `clothing-inventory-backend` `pm2` process.

The repo variable `BACKEND_ENV_FILE` must point to the absolute path of the
`.env` file on the EC2 host (kept outside the workspace because
`actions/checkout` runs `git clean -ffdx`).

---

## Scripts Reference

Root (`package.json`):
- `npm run install-all` — install root + backend + frontend deps
- `npm run dev` — nodemon backend + CRA dev server in parallel
- `npm start` — production-style backend + CRA dev server in parallel

Backend (`backend/package.json`):
- `npm start` / `npm run prod` — `node server.js`
- `npm run dev` — `nodemon server.js`
- `npm test` — Mocha against the in-memory Mongo

Frontend (`frontend/package.json`):
- `npm start` — CRA dev server
- `npm run build` — production build
- `npm test` — CRA test runner
