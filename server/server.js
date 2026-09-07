import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import { products as demoProducts } from './data/products.js';

const app = express();
const port = process.env.PORT || 5001;
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

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const searchTokens = (value) => normalize(value).split(' ').filter(Boolean).flatMap((token) => [token, ...(searchAliases[token] || [])]);
const searchableProductText = (product) => normalize([product.name, product.brand, product.category, product.description, ...(product.variants || []).map((variant) => variant.value), ...Object.values(product.specifications || {})].join(' '));
const matchesSearch = (product, search) => {
  if (!search) return true;
  const text = searchableProductText(product);
  return searchTokens(search).some((token) => text.includes(token));
};

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

const getProducts = async ({ category, search }) => {
  if (mongoose.connection.readyState === 1) {
    const query = { isActive: true };
    if (category && category !== 'all') query.category = category.toLowerCase();
    if (search) {
      const terms = searchTokens(search).map((term) => new RegExp(term, 'i'));
      query.$or = terms.flatMap((term) => [{ name: term }, { brand: term }, { category: term }, { description: term }]);
    }
    return Product.find(query).sort({ createdAt: -1 }).lean();
  }
  return productSource.filter((product) => (!category || category === 'all' || product.category === category) && matchesSearch(product, search));
};

app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'mongodb' : 'demo-data' }));
app.get('/api/categories', async (_req, res, next) => {
  try { res.json([...new Set((await getProducts({})).map((product) => product.category))]); } catch (error) { next(error); }
});
app.get('/api/products', async (req, res, next) => {
  try { res.json(await getProducts({ category: req.query.category, search: req.query.search })); } catch (error) { next(error); }
});
app.get('/api/products/:id', async (req, res, next) => {
  try {
    const product = mongoose.connection.readyState === 1 ? await Product.findOne({ _id: req.params.id, isActive: true }).lean() : productSource.find((item) => item._id === req.params.id || item.name.toLowerCase().replaceAll(' ', '-') === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) { next(error); }
});
app.use((error, _req, res, _next) => res.status(500).json({ message: 'Unable to complete request' }));

const start = async () => {
  if (process.env.MONGODB_URI) {
    try { await mongoose.connect(process.env.MONGODB_URI); productSource = await Product.find({ isActive: true }).lean(); console.log('MongoDB connected'); }
    catch (error) { console.warn('MongoDB unavailable, serving demo data'); }
  } else console.warn('MONGODB_URI missing, serving demo data');
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
};
start();
