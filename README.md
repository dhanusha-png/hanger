# HangerHome Premium Full-Stack

A premium HangerHome e-commerce/service demo with a dark luxury glassmorphism UI, animated light-sweep interactions, product catalog, gallery, customer accounts, checkout demo, service/quote requests, AI-style website assistant, and protected admin controls.

## Project structure

- `client/` — Vite + React frontend
- `server/` — Express + MongoDB backend
- `client/public/products/` — 20 distinct product visuals (10 Hangers + 10 Shoe Racks)
- `client/public/media/` — supplied HangerHome installation photos/video used by the Gallery and selected showcase sections

## Run locally

From the project root:

```powershell
npm install
npm run install:all
npm run dev
```

Or run the two applications separately:

```powershell
npm --prefix server install
npm --prefix client install
npm --prefix server run dev
npm --prefix client run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

## Database

The supplied `server/.env` is kept with this demo package so the current MongoDB connection configuration can be used. Do not publish that file to a public repository. Use `server/.env.example` when creating a fresh deployment.

Required environment variables:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- optional `OPENAI_API_KEY`
- optional `OPENAI_MODEL`

## Seed the demo catalog

```powershell
npm run seed
```

The seed creates/updates:

- 20 active products
- 10 Hangers
- 10 Shoe Racks
- Admin demo account
- Customer demo account
- Website settings and gallery content
- Demo coupon

Demo admin:

- Email: `admin@example.com`
- Password: `Admin@123`

Demo customer:

- Email: `customer@example.com`
- Password: `Customer@123`

Change these credentials before any real deployment.

## Main features

### Public website

- Premium dark glassmorphism visual system
- Animated corner light and perimeter light-sweep effects
- Responsive sticky navigation
- Home hero carousel and product CTA
- Products, product detail, search, filters and sorting
- Wishlist and cart
- Checkout with COD and clearly-labelled Razorpay demo flow
- Customer registration/login/account
- Installation booking and custom quote requests
- Functional contact enquiry form
- Real installation Gallery with supplied project media
- Services, Installations, About and Contact pages
- AI-style website assistant with greeting-first responses

### Admin

Protected `/admin` control center with:

- Dashboard statistics
- Full product CRUD
- Product images and video URL management
- Product pricing, stock, SKU, model, tags, features and specifications
- Visibility/featured/buy/quote/installation toggles
- Order status management
- Customer list
- Service request status management
- Quote request status management
- Contact enquiry filtering/status management
- Review moderation with verified-purchase visibility
- Gallery media/content management
- Website settings

## Important demo behavior

The Razorpay option is intentionally a **demo payment flow**. It records a demo online payment; it does not charge a real card/UPI account. Connect the real Razorpay SDK/API before production use.

Customer reviews are not seeded as fake reviews. Product rating/review counts start at zero and can be populated through the real review flow after eligible delivered orders.
