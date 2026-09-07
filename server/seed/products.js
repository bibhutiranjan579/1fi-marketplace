import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { products } from '../data/products.js';

const run = async () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);
  await mongoose.disconnect();
};

run().catch((error) => { console.error(error.message); process.exit(1); });
