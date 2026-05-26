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
│   └── pipeline.yml          Test, build, release, and deploy in one workflow
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

### System

| Method | Path       | Purpose                              |
| ------ | ---------- | ------------------------------------ |
| GET    | `/health`  | Liveness + current version (public)  |

### Auth — `/auth`

| Method | Path        | Purpose                              |
| ------ | ----------- | ------------------------------------ |
| POST   | `/register` | Create a new staff account (public)  |
| POST   | `/login`    | Issue a JWT (public)                 |
| GET    | `/profile`  | Get current user                     |
| PUT    | `/profile`  | Update current user                  |

### Categories — `/categories`

| Method | Path            | Purpose                       |
| ------ | --------------- | ----------------------------- |
| GET    | `/`             | List categories               |
| POST   | `/`             | Create category **(admin)**   |
| GET    | `/:categoryId`  | Get category                  |
| PUT    | `/:categoryId`  | Update category **(admin)**   |
| DELETE | `/:categoryId`  | Delete category **(admin)**   |

### Brands — `/brands`

| Method | Path         | Purpose                    |
| ------ | ------------ | -------------------------- |
| GET    | `/`          | List brands                |
| POST   | `/`          | Create brand **(admin)**   |
| GET    | `/:brandId`  | Get brand                  |
| PUT    | `/:brandId`  | Update brand **(admin)**   |
| DELETE | `/:brandId`  | Delete brand **(admin)**   |

### Products — `/products`

| Method | Path                  | Purpose                                  |
| ------ | --------------------- | ---------------------------------------- |
| GET    | `/`                   | List products                            |
| POST   | `/`                   | Create product                           |
| GET    | `/:productId`         | Get product                              |
| PUT    | `/:productId`         | Update product                           |
| PATCH  | `/:productId/status`  | Activate/deactivate product **(admin)**  |
| DELETE | `/:productId`         | Delete product                           |

### Product variants — `/products/variants`

| Method | Path                | Purpose                              |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/`                 | List variants                        |
| POST   | `/`                 | Create variant                       |
| GET    | `/:sku`             | Get variant                          |
| PUT    | `/:sku`             | Update variant                       |
| POST   | `/:sku/inventory`   | Adjust stock (logs an audit entry)   |
| DELETE | `/:sku`             | Delete variant                       |

### Inventory audits — `/inventory-audits` (admin)

| Method | Path  | Purpose             |
| ------ | ----- | ------------------- |
| GET    | `/`   | List audit entries  |

### Admin — `/admin` (admin)

| Method | Path                  | Purpose                       |
| ------ | --------------------- | ----------------------------- |
| GET    | `/analytics`          | Dashboard analytics           |
| GET    | `/low-stock`          | Low-stock variants            |
| GET    | `/users`              | List users                    |
| PUT    | `/users/:id/status`   | Activate/deactivate user      |
| PUT    | `/users/:id/role`     | Change user role              |
| DELETE | `/users/:id`          | Delete user                   |

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

A single workflow — **`.github/workflows/pipeline.yml`** — covers the full
lifecycle. Jobs:

| Job              | Pull request to `main` | Push to `main`                                      |
| ---------------- | ---------------------- | --------------------------------------------------- |
| `backend-test`   | ✅ runs                | ✅ runs                                              |
| `frontend-build` | ✅ runs                | ✅ runs                                              |
| `release`        | skipped                | ✅ after both above pass — `npm version patch` + tag |
| `deploy-test`    | skipped                | ✅ after `release` — **gated by manual approval**    |

The workflow skips its own `chore(release):` commits to avoid recursion. The
frontend is deployed separately by **AWS Amplify**; this pipeline only ships the
backend.

### Manual approval gate

`deploy-test` targets a GitHub **Environment** named `test`. To make the
approval prompt fire, create that environment once in the repo:

1. **Settings → Environments → New environment → `test`**
2. Tick **Required reviewers** and add the approvers
3. *(Recommended)* Move `BACKEND_ENV_FILE` to environment-level variables on `test`

Without this setup the job runs without gating.

### Deploy details

`deploy-test` runs on a self-hosted runner on the EC2 host. It checks out the
new release tag, installs prod deps, symlinks `$BACKEND_ENV_FILE` as `.env`
(kept outside the workspace because `actions/checkout` runs `git clean -ffdx`),
and reloads the `clothing-inventory-backend` `pm2` process.

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
