# 1Fi Marketplace

A modern, responsive e-commerce marketplace inspired by the 1Fi shopping experience. Browse products, search and filter the catalog, save favorites, add products to your shopping bag, and explore EMI payment options through a clean and responsive interface.

## 🚀 Live Demo

### 🌐 [Visit the Live Website](https://1fi-marketplace-nfbr.vercel.app/)

**Frontend:** https://1fi-marketplace-nfbr.vercel.app/

**Backend API:** https://onefi-marketplace-w5mt.onrender.com/

---

## 📖 Overview

1Fi Marketplace is a full-stack marketplace application built with React and Node.js.

The application provides a complete product browsing experience with product discovery, search, filtering, product details, favorites, cart management, and EMI plan selection.

The frontend is deployed on Vercel, while the Express backend is deployed on Render. The backend is MongoDB-ready and includes a bundled demo catalog that automatically acts as a fallback when MongoDB is unavailable or contains no products.

---

## ✨ Features

- 🛍️ Responsive marketplace storefront
- 🔎 Live product search
- 🗂️ Category-based product filtering
- ⭐ Save products to favorites
- 🛒 Add products to shopping bag
- 💳 EMI plan selection
- 📊 Monthly EMI payment summary
- 🖼️ Product image gallery
- 🎨 Product variant selection
- 📱 Fully responsive design
- 💻 Desktop, tablet, and mobile support
- ⚡ Fast Vite-powered frontend
- 🔄 Loading and empty states
- 💾 Persistent favorites using browser local storage
- 💾 Persistent shopping bag using browser local storage
- 🌐 REST API built with Express
- 🍃 MongoDB support using Mongoose
- 📦 Bundled demo product catalog
- 🔁 Automatic demo-data fallback when MongoDB is unavailable or empty
- ☁️ Production deployment using Vercel and Render

---

## 🛠️ Tech Stack

### Frontend

- React
- React Router
- Vite
- Tailwind CSS v4
- Lucide React

### Backend

- Node.js
- Express.js
- CORS
- dotenv

### Database

- MongoDB
- Mongoose

### Deployment

- Vercel
- Render
- GitHub

---

## 📁 Project Structure

```text
1fi-marketplace/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json
│   └── package.json
│
├── server/
│   ├── data/
│   │   └── products.js
│   ├── models/
│   │   └── Product.js
│   ├── seed/
│   ├── server.js
│   └── package.json
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 🧭 Application Routes

| Route | Description |
|---|---|
| `/shop` | Branded shop landing page |
| `/marketplace` | Searchable and filterable marketplace catalog |
| `/marketplace/product/:productId` | Product details, variants, EMI plans, and checkout handoff |
| `/saved` | Saved/favorite products |
| `/cart` | Shopping bag and EMI handoff |

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/bibhutiranjan579/1fi-marketplace.git
cd 1fi-marketplace
```

### 2. Create the environment file

```bash
cp .env.example .env
```

### 3. Install dependencies

Install all frontend and backend dependencies:

```bash
npm run install:all
```

---

## 🍃 MongoDB Configuration

MongoDB is optional.

If you want to use MongoDB locally, configure your `.env` file:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/onefi-marketplace
CLIENT_URL=http://localhost:5173
```

If MongoDB is unavailable, the backend automatically uses the bundled demo catalog.

If MongoDB is connected but the product collection is empty, the bundled demo catalog is also used.

---

## ▶️ Run the Application

### Run frontend and backend together

```bash
npm run dev
```

### Run backend separately

```bash
npm run dev --prefix server
```

### Run frontend separately

```bash
npm run dev --prefix client
```

The application will typically be available at:

**Frontend:**

```text
http://localhost:5173
```

**Backend API:**

```text
http://localhost:5001
```

---

## 🏗️ Build the Frontend

Build the production frontend:

```bash
npm run build
```

Or build the client directly:

```bash
npm run build --prefix client
```

The production frontend files will be generated inside:

```text
client/dist/
```

---

## 🔌 API Endpoints

### Health Check

```http
GET /api/health
```

Returns the API status and current database/data source.

Example:

```json
{
  "status": "ok",
  "database": "demo-data"
}
```

### Get Products

```http
GET /api/products
```

Returns the complete product catalog.

### Filter Products by Category

```http
GET /api/products?category=mobiles
```

Example categories include:

- mobiles
- laptops
- tvs
- accessories
- appliances

### Search Products

```http
GET /api/products?search=phone
```

Products can be searched by:

- Product name
- Brand
- Category
- Description
- Variants
- Specifications

### Get Product by ID

```http
GET /api/products/:id
```

Returns a single product.

### Get Categories

```http
GET /api/categories
```

Returns the available product categories.

---

## 💾 Browser Storage

The application uses browser local storage to persist user selections.

### Favorites

```text
onefi-favorites
```

### Shopping Bag

```text
onefi-cart
```

No authentication or user account is currently required for these features.

---

## ☁️ Deployment Architecture

The application uses a separate frontend and backend deployment architecture:

```text
                    GitHub
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
       client/                 server/
          │                       │
          ▼                       ▼
       Vercel                  Render
          │                       │
          │                       ▼
          │                    Express
          │                       │
          │                       ▼
          │                    MongoDB
          │
          ▼
    React Marketplace
```

### Production Frontend

```text
https://1fi-marketplace-nfbr.vercel.app/
```

### Production Backend

```text
https://onefi-marketplace-w5mt.onrender.com/
```

---

## 🔐 Environment Variables

### Frontend

The Vercel frontend uses:

```env
VITE_API_URL=https://onefi-marketplace-w5mt.onrender.com
```

This tells the React application where the production Express API is hosted.

### Backend

The Render backend can use:

```env
PORT=10000
MONGODB_URI=<your-mongodb-connection-string>
CLIENT_URL=https://1fi-marketplace-nfbr.vercel.app
```

---

## 🔄 Demo Product Fallback

The project includes a bundled demo catalog inside:

```text
server/data/products.js
```

The application is designed to continue working even without a populated MongoDB database.

The backend follows this logic:

```text
MongoDB available
       │
       ├── Products exist
       │       ↓
       │    Use MongoDB
       │
       └── No products
               ↓
        Use demo catalog


MongoDB unavailable
       │
       ↓
Use demo catalog
```

This makes the project easy to run locally and easy to demonstrate without requiring a database to be populated first.

---

## 🎨 UI & Responsive Design

The marketplace is designed for multiple screen sizes:

- Desktop
- Laptop
- Tablet
- iPad
- Mobile
- iPhone

The navigation adapts based on screen width.

A compact logo-and-menu navigation is used below 1280px, while the full desktop navigation is displayed at 1280px and above.

Product detail pages are also optimized for smaller screens to avoid navigation overlap.

---

## 💳 EMI Experience

The product detail page includes an EMI-focused purchase experience.

Users can:

1. Open a product
2. View product information
3. Select a product variant
4. View available EMI plans
5. Select an EMI option
6. Review the monthly payment amount
7. Proceed to the EMI confirmation flow

The EMI calculations and pricing currently use demo data and can be connected to a real financing system in the future.

---

## 📝 Notes

- Product pricing is currently demo data.
- EMI values are currently demo data.
- The application does not currently process real payments.
- Favorites are stored in browser local storage.
- Shopping bag items are stored in browser local storage.
- MongoDB is supported through Mongoose.
- The application automatically falls back to demo products if MongoDB is unavailable or empty.
- The backend provides REST API endpoints for the frontend.
- The frontend communicates with the deployed Render API using `VITE_API_URL`.
- The application is designed for responsive desktop and mobile experiences.
- The footer displays the current marketplace preview year as 2026.

---

## 🚀 Future Improvements

Potential future enhancements include:

- User authentication
- User accounts
- Real payment integration
- Real EMI/financing integration
- Order management
- Order history
- Wishlist synchronization
- Admin dashboard
- Product management dashboard
- Inventory management
- Real-time inventory updates
- Product reviews and ratings
- Advanced filtering
- Pagination
- Cloud image storage
- Production analytics

---

## 👨‍💻 Author

**Bibhuti Ranjan**

GitHub: [@bibhutiranjan579](https://github.com/bibhutiranjan579)

---

## 🔗 Important Links

### 🌐 Live Website

[**https://1fi-marketplace-nfbr.vercel.app/**](https://1fi-marketplace-nfbr.vercel.app/)

### 💻 GitHub Repository

[**https://github.com/bibhutiranjan579/1fi-marketplace**](https://github.com/bibhutiranjan579/1fi-marketplace)

### ⚙️ Backend API

[**https://onefi-marketplace-w5mt.onrender.com/**](https://onefi-marketplace-w5mt.onrender.com/)

---

⭐ If you like this project, consider giving the repository a star!