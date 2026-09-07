# 1Fi Marketplace

A responsive storefront inspired by the 1Fi shopping experience, built to browse products, save favorites, add items to a shopping bag, and compare EMI options in a clean marketplace layout.

## Overview

This project includes:

- A branded home/shop landing experience
- A searchable and filterable marketplace catalog
- Product cards with pricing, discounts, and save-to-favorites actions
- Full product detail pages with image gallery, variant selection, EMI plans, and a proceed-to-EMI confirmation flow
- Saved products and cart pages with persistent browser storage
- Responsive Tailwind layouts for desktop, tablet, and mobile devices
- Demo product data with a fallback API when MongoDB is unavailable

## Features

- Product listing with category filters and live search
- Featured 1Fi Marketplace navigation and action bar
- Save favorite products and keep them in a dedicated collection page
- Add products to bag and view total value on the cart page
- Product detail view with EMI plan selection, monthly payment summary, and proceed-to-EMI confirmation
- Search result counts with responsive empty and loading states
- Fully responsive layout for small and large viewports, including iPhone and iPad widths
- Compact logo-and-menu navbar below 1280px, with the full desktop navigation at 1280px and above
- Product detail pages omit the fixed navbar to prevent mobile overlap
- Express API and demo inventory for rapid local testing

## Tech Stack

- Frontend: React, React Router, Vite, Tailwind CSS v4, Lucide React
- Backend: Node.js, Express
- Data layer: MongoDB-ready via Mongoose, with demo-data fallback

## Project Structure

```bash
.
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
├── server/
│   ├── data/
│   ├── models/
│   ├── server.js
│   └── package.json
├── package.json
├── .env.example
├── README.md
└── package-lock.json
```

## Routes

- `/shop` — branded shop landing page
- `/marketplace` — searchable and filterable product catalog
- `/marketplace/product/:productId` — product details, variants, EMI plans, and checkout handoff
- `/saved` — saved products
- `/cart` — shopping bag and EMI handoff

## Setup

Create the environment file and install all dependencies:

```bash
cp .env.example .env
npm run install:all
```

If you have MongoDB configured, set `MONGODB_URI` in `.env`. If it is not set, the app will continue to serve the bundled demo catalog.

## Run the app

Start the frontend and backend together:

```bash
npm run dev
```

Or run each separately:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

The app will typically run at:

- Frontend: http://localhost:5173
- API: http://localhost:5001

## Build

```bash
npm run build
```

The client can also be built directly with `npm run build --prefix client`.

## API

- `GET /api/health` — API status and database connection state
- `GET /api/products` — fetch products with optional `category` and `search` filters
- `GET /api/products?category=mobiles` — filter by category
- `GET /api/products?search=phone` — search by name, brand, or description
- `GET /api/products/:id` — fetch one product by ID or demo slug
- `GET /api/categories` — list available categories

## Notes

- The storefront uses browser local storage for saved favorites and the shopping bag.
- Saved products use the `onefi-favorites` local-storage key; cart items use `onefi-cart`.
- The catalog is intentionally styled to feel premium and finance-friendly, with a purple and neutral palette aligned to the 1Fi branding direction.
- Product pricing and EMI values are demo data and can be replaced with real catalog data when connected to a backend database.
- The footer displays the current marketplace preview year as 2026.
