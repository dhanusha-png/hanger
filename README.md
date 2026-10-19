<p align="center">
  <img src="client/public/og-image.png" alt="HangerHome" width="540" />
</p>

# HangerHome Luxury Full-Stack E-Commerce & Service Platform

A production-ready, full-stack luxury e-commerce and home service web application for **HangerHome**. Built with a Vite + React frontend, an Express REST API backend, and MongoDB via Mongoose. Every piece of public content—from the dynamic category catalog to gallery media, client reviews, FAQs, company metrics, and site settings—is driven directly by the database and fully manageable via an intuitive, dark-forest-and-gold admin control suite.

---

## 🌟 Key Highlights & Architecture

- **Public Client**: High-performance Single Page Application (SPA) built with Vite, React 19, Tailwind CSS, Lucide icons, and Framer Motion. Maintains a signature dark emerald/forest (`#04120e`) and champagne gold (`#e8c070`) luxury aesthetic with glassmorphism, responsive navigation, dynamic category catalog, search, wishlist/cart synchronisation, coupon discounts, and order tracking.
- **RESTful Express API**: Modular backend with strict separation of concerns, comprehensive role-based access control (RBAC), NoSQL query sanitization, in-memory rate limiting, Helmet HTTP security headers, gzip/deflate compression, and Sharp WebP media pipelines.
- **Database Architecture**: 14 Mongoose models with additive schemas, text indexes, unique constraints, and automated non-destructive seeding.
- **Admin Control Center (`/admin`)**: Dedicated luxury management dashboard supporting 15+ modules: live store analytics, products, categories, orders with timeline histories, customers, service & installation bookings, enquiries, gallery items, reviews, FAQs, testimonials, coupons, newsletter subscribers, website settings, staff management, and audit logs.

---

## 📁 Repository Structure

```text
hanger-commerce/
├── client/                     # Vite + React Frontend Application
│   ├── public/                 # Static assets, sitemap.xml, robots.txt
│   ├── src/
│   │   ├── admin/              # Admin Panel views & components (17 modules)
│   │   ├── components/         # Shared UI components, layout, navbar, footer
│   │   ├── context/            # Global state: AuthContext, CartContext, WishlistContext
│   │   ├── lib/                # API client with automatic JWT token refresh
│   │   ├── products/           # Product catalog, filters, detail views
│   │   ├── home/               # Hero carousel, featured showcases, counters
│   │   ├── gallery/            # Database-driven installation media gallery
│   │   ├── installations/      # Service categories, booking modal, FAQs
│   │   └── main.jsx            # Application routing & admin protected routes
│   └── package.json
│
├── server/                     # Express REST API & Database
│   ├── backups/                # Automated database backups
│   ├── scripts/                # Database backup & restore helpers
│   ├── src/
│   │   ├── controllers/        # Business logic for admin & public endpoints
│   │   ├── middleware/         # requireAuth, requireRole, uploads, security
│   │   ├── models/             # Mongoose schemas (Product, Order, User, etc.)
│   │   ├── routes/             # authRoutes, adminRoutes, publicRoutes
│   │   ├── utils/              # Sharp WebP image processing, email helper, tokens
│   │   ├── index.js            # Express server entry point & static asset serving
│   │   └── seed.js             # Non-destructive idempotent database seeder
│   └── package.json
│
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance running on `localhost:27017` or a MongoDB Atlas connection URI.

### 2. Installation
Install all root, client, and server dependencies with a single command:
```powershell
npm run install:all
```

### 3. Configure Environment Variables
Create `.env` files in both `server/` and `client/` directories based on the provided examples:

```powershell
# Copy backend template
cp server/.env.example server/.env

# Copy frontend template
cp client/.env.example client/.env
```

### 4. Seed the Database
Populate the database with the default catalog, categories, site settings, FAQs, testimonials, and the first administrator:
```powershell
npm run seed
```

> **Safe & Idempotent**: The seed script checks for existing records and never drops or overwrites existing collections. It can be executed safely at any time.

### 5. Launch the Development Servers
Start both the Express API and Vite React development server concurrently:
```powershell
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`
- **Admin Control Center**: `http://localhost:5173/admin`

---

## 🔑 Default Credentials

After running `npm run seed`:

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hangerhome.com` | `Admin@HangerHome2026` | Full system control, settings, user roles, logs |
| **Staff** | `staff@hangerhome.com` | `Staff@HangerHome2026` | Orders, Bookings, Enquiries, Gallery |
| **Customer** | `customer@example.com` | `Customer@123` | Store browsing, cart, orders, wishlist |

*(You can also define custom admin credentials via `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env` prior to seeding).*

---

## ⚙️ Environment Variables Reference

### Backend (`server/.env`)

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | No | `5000` | Port for the Express REST API. |
| `NODE_ENV` | No | `development` | `development` or `production`. Controls stack trace exposure and CORS. |
| `MONGODB_URI` | **Yes** | `mongodb://127.0.0.1:27017/hanger_commerce` | MongoDB connection string (local or Atlas URI). |
| `JWT_SECRET` | **Yes** | — | Secret key used to sign access JWTs (min 32 chars). |
| `JWT_REFRESH_SECRET` | No | — | Secret key used to sign refresh JWTs. |
| `CLIENT_URL` | No | `http://localhost:5173` | Public frontend URL. Allowed in CORS; used in email links and sitemaps. |
| `ADMIN_EMAIL` | No | `admin@hangerhome.com` | Initial admin account email for automated seeding. |
| `ADMIN_PASSWORD` | No | `Admin@HangerHome2026` | Initial admin password for automated seeding. |
| `ADMIN_NAME` | No | `Store Administrator` | Display name of the initial administrator. |
| `ADMIN_PHONE` | No | `+91 98765 43210` | Contact phone for initial administrator. |
| `RAZORPAY_KEY_ID` | No | — | Razorpay API key ID for online payments. |
| `RAZORPAY_KEY_SECRET` | No | — | Razorpay API key secret (strictly server-side). |
| `RAZORPAY_WEBHOOK_SECRET`| No | — | Secret for verifying Razorpay webhook signatures. |
| `SMTP_HOST` | No | — | SMTP mail server hostname (e.g. `smtp.gmail.com`). |
| `SMTP_PORT` | No | `587` | SMTP port (typically 587 for TLS, 465 for SSL). |
| `SMTP_SECURE` | No | `false` | Set `true` if port 465 SSL is required. |
| `SMTP_USER` | No | — | SMTP authentication user / email. |
| `SMTP_PASS` | No | — | SMTP authentication password / app token. |
| `SMTP_FROM` | No | — | Default sender header (e.g. `"HangerHome" <orders@hangerhome.com>`). |
| `CLOUDINARY_CLOUD_NAME`| No | — | Optional Cloudinary cloud name for cloud media storage. |
| `CLOUDINARY_API_KEY` | No | — | Optional Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | No | — | Optional Cloudinary API secret. |
| `OPENAI_API_KEY` | No | — | Optional API key powering the AI shopping concierge. |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | Model name for AI assistant queries. |

### Frontend (`client/.env`)

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | **Yes** | `http://localhost:5000/api` | Endpoint base for all API calls. |
| `VITE_API_ORIGIN` | No | `http://localhost:5000` | Host origin for uploaded local images (`/uploads/*`). |
| `VITE_RAZORPAY_KEY_ID` | No | — | Public Razorpay key ID for browser checkout. |

---

## 🛡️ Security & Role-Based Access Control (RBAC)

The platform enforces three distinct user roles:

1. **`admin`**:
   - Complete access to all 15+ admin views, system metrics, settings, user management, and audit logs.
   - Capability to assign roles, block/unblock accounts, modify pricing and stock, and adjust store configuration.
2. **`staff`**:
   - Focused operational access restricted to:
     - Orders (status progression, tracking updates, customer notes)
     - Service & Installation Bookings (technician assignment, scheduling)
     - Customer Enquiries (status follow-up, notes, CSV export)
     - Gallery Media (adding and organizing photos/videos)
   - Blocked from administrative controls, settings, user role elevation, and audit logs.
3. **`customer`**:
   - Access to account profile, address book, synchronized wishlist and cart, and real-time order history tracking.

### Security Layers
- **Password Security**: Bcrypt password hashing with high salt work factor.
- **JWT Authentication**: Short-lived access tokens delivered via `httpOnly`, `SameSite: strict` secure cookies with support for Authorization Bearer headers and automatic token refresh.
- **Request Sanitization**: Custom NoSQL injection sanitizer (`$where`, `$gt`, operator stripping) across `req.body`, `req.query`, and `req.params`.
- **Brute-Force Protection**: IP rate-limiting applied across auth and public enquiry routes.
- **Media Optimization**: Multer memory storage coupled with Sharp converts all uploads to progressive WebP, stripping EXIF metadata and resizing automatically.

---

## 💾 Database Backup & Restore

The application includes non-destructive database backup and restoration utilities located in `server/scripts/`.

### Create a Database Backup
```powershell
npm run backup
```
- First attempts to execute binary `mongodump` if installed.
- Automatically falls back to native Mongoose streaming export, producing timestamped JSON collections and a `manifest.json` under `server/backups/backup_YYYY-MM-DD_HH-mm-ss/`.

### Restore from a Backup
```powershell
# Restores from the most recent backup folder
npm run restore

# Or specify a custom backup folder path:
npm run restore -- "server/backups/backup_2026-10-19_12-52-03"
```
- Uses `$setOnInsert` upserts, ensuring existing database records are never deleted or overridden.

---

## 🚢 Production Deployment Guide

### Option A: Monolithic Single-Server (Express serves Client)
In this architecture, Express serves the pre-built React SPA, static uploads, and all REST endpoints from one Node.js process:

1. **Build the Client**:
   ```powershell
   npm run build
   ```
2. **Set Production Environment**:
   In `server/.env`:
   ```ini
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/hanger_commerce
   JWT_SECRET=use_a_very_secure_random_string_of_64_characters
   CLIENT_URL=https://hangerhome.com
   ```
3. **Start the Production Server**:
   ```powershell
   npm run start
   ```
   Express will automatically serve `client/dist` with gzip compression, caching headers, dynamic `sitemap.xml`, and protected `robots.txt`.

### Option B: Decoupled Cloud Deployment (Vercel + Render + MongoDB Atlas)

1. **Database (MongoDB Atlas)**:
   - Create a free or dedicated cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
   - Add database user credentials and configure IP Access List (`0.0.0.0/0` for cloud providers).
   - Copy connection string into `MONGODB_URI`.

2. **Backend API (Render / Railway / VPS)**:
   - Root directory: `server/`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Set environment variables listed in the Backend table above.

3. **Frontend Client (Vercel / Netlify / Cloudflare Pages)**:
   - Root directory: `client/`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL`: `https://api.hangerhome.com/api`
     - `VITE_API_ORIGIN`: `https://api.hangerhome.com`

---

## 📜 Available NPM Scripts

| Command | Working Directory | Description |
| :--- | :--- | :--- |
| `npm run dev` | Root | Starts both Vite dev server and Express nodemon in parallel. |
| `npm run build` | Root / `client` | Compiles the production React application into `client/dist`. |
| `npm run start` | Root / `server` | Launches the production Express API server. |
| `npm run seed` | Root / `server` | Non-destructive database seeder for default models & admin. |
| `npm run backup` | Root / `server` | Exports database collections to JSON with manifest. |
| `npm run restore` | Root / `server` | Non-destructive restore from the latest database backup. |

---

## 📄 License
All rights reserved © 2026 HangerHome Luxury Living.
