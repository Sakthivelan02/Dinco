# Dinco — MERN E-Commerce

A full-stack store built with **MongoDB, Express, React (Vite) and Node**.

## Features
- Product list with search, category filter, price cap, sorting and pagination
- Product detail, server-side cart (add / update / remove), checkout and order confirmation
- JWT authentication, account page (update details, order history)
- Admin dashboard: add/delete products, update order status
- Security: bcrypt hashing, helmet, CORS allow-list, auth rate limit, prices and totals computed on the server
- Payment is a **demo** (card number is never sent or stored). Add Stripe in `POST /api/orders` if desired.

## Local setup
```bash
# 1. API
cd server && cp .env.example .env     # fill MONGO_URI and JWT_SECRET
npm install && npm run seed && npm run dev

# 2. Client (new terminal)
cd client && npm install && npm run dev   # http://localhost:5173
```
Seed accounts: `admin@shop.test / admin123`, `user@shop.test / user123`.

## Environment variables
| File | Variable | Purpose |
|---|---|---|
| server/.env | `MONGO_URI` | MongoDB Atlas connection string |
| server/.env | `JWT_SECRET` | Long random string |
| server/.env | `CLIENT_URL` | Frontend origin(s), comma-separated (CORS) |
| client/.env | `VITE_API_URL` | Deployed API URL ending in `/api` |

## Deployment
1. **MongoDB Atlas**: create a free cluster, allow network access, copy the URI.
2. **API on Render**: root `server`, build `npm install`, start `npm start`; set the three env vars (`CLIENT_URL` = your frontend URL).
3. **Client on Vercel/Netlify**: root `client`, build `npm run build`, output `dist`; set `VITE_API_URL`.
4. Run the seed once (`npm run seed` locally with the Atlas URI) to create sample data.

## API summary
`/api/auth/{register,login,me}` · `/api/products` (GET public, write = admin) · `/api/cart` (auth) · `/api/orders` (auth; list all = admin)

Lint/format: `npm run lint` in each folder, `npx prettier --write .`
