import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import { products as demoProducts } from './data/products.js';

const app = express();
const port = process.env.PORT || 5001;

// Start with demo catalog
let productSource = demoProducts;

const searchAliases = {
  phone: ['mobile', 'smartphone', 'mobiles'],
  phones: ['mobile', 'smartphone', 'mobiles'],
  smartphone: ['mobile', 'mobiles'],
  computer: ['laptop', 'laptops'],
  notebook: ['laptop', 'laptops'],
  television: ['tv', 'tvs'],
  earphones: ['earbuds', 'accessories'],
  headphones: ['earbuds', 'accessories'],
  fridge: ['refrigerator', 'appliances'],
  vacuum: ['cleaner', 'appliances']
};

const normalize = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const searchTokens = (value) =>
  normalize(value)
    .split(' ')
    .filter(Boolean)
    .flatMap((token) => [
      token,
      ...(searchAliases[token] || [])
    ]);

const searchableProductText = (product) =>
  normalize(
    [
      product.name,
      product.brand,
      product.category,
      product.description,
      ...(product.variants || []).map((variant) => variant.value),
      ...Object.values(product.specifications || {})
    ].join(' ')
  );

const matchesSearch = (product, search) => {
  if (!search) return true;

  const text = searchableProductText(product);

  return searchTokens(search).some((token) =>
    text.includes(token)
  );
};

// ----------------------------------------------------
// Middleware
// ----------------------------------------------------

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
  })
);

app.use(express.json());

// ----------------------------------------------------
// Get products
// ----------------------------------------------------

const getProducts = async ({ category, search }) => {

  // Use MongoDB only when it actually contains products.
  if (
    mongoose.connection.readyState === 1 &&
    productSource !== demoProducts
  ) {
    const query = {
      isActive: true
    };

    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    if (search) {
      const terms = searchTokens(search).map(
        (term) => new RegExp(term, 'i')
      );

      query.$or = terms.flatMap((term) => [
        { name: term },
        { brand: term },
        { category: term },
        { description: term }
      ]);
    }

    return Product.find(query)
      .sort({ createdAt: -1 })
      .lean();
  }

  // Fallback to dummy catalog
  return productSource.filter(
    (product) =>
      (!category ||
        category === 'all' ||
        product.category === category) &&
      matchesSearch(product, search)
  );
};

// ----------------------------------------------------
// Health check
// ----------------------------------------------------

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database:
      mongoose.connection.readyState === 1 &&
      productSource !== demoProducts
        ? 'mongodb'
        : 'demo-data'
  });
});

// ----------------------------------------------------
// Categories
// ----------------------------------------------------

app.get('/api/categories', async (_req, res, next) => {
  try {
    const products = await getProducts({});

    res.json([
      ...new Set(
        products.map((product) => product.category)
      )
    ]);
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------
// Products
// ----------------------------------------------------

app.get('/api/products', async (req, res, next) => {
  try {
    const products = await getProducts({
      category: req.query.category,
      search: req.query.search
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------
// Product by ID
// ----------------------------------------------------

app.get('/api/products/:id', async (req, res, next) => {
  try {
    let product;

    if (
      mongoose.connection.readyState === 1 &&
      productSource !== demoProducts
    ) {
      product = await Product.findOne({
        _id: req.params.id,
        isActive: true
      }).lean();
    } else {
      product = productSource.find(
        (item) =>
          item._id === req.params.id ||
          item.name
            .toLowerCase()
            .replaceAll(' ', '-') === req.params.id
      );
    }

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// ----------------------------------------------------
// Error handler
// ----------------------------------------------------

app.use((error, _req, res, _next) => {
  console.error(error);

  res.status(500).json({
    message: 'Unable to complete request'
  });
});

// ----------------------------------------------------
// Start server
// ----------------------------------------------------

const start = async () => {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);

      const databaseProducts = await Product.find({
        isActive: true
      })
        .sort({ createdAt: -1 })
        .lean();

      if (databaseProducts.length > 0) {
        // MongoDB has products → use MongoDB
        productSource = databaseProducts;

        console.log(
          `MongoDB connected: ${databaseProducts.length} products loaded`
        );
      } else {
        // MongoDB is connected but empty → use demo catalog
        console.log(
          `MongoDB connected but empty. Using ${demoProducts.length} demo products`
        );
      }

    } catch (error) {
      // MongoDB failed → use demo catalog
      console.warn(
        'MongoDB unavailable, serving demo data:',
        error.message
      );
    }
  } else {
    console.warn(
      `MONGODB_URI missing, serving ${demoProducts.length} demo products`
    );
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`API listening on port ${port}`);
  });
};

start();