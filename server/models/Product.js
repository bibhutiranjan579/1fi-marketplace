import mongoose from 'mongoose';

const emiPlanSchema = new mongoose.Schema({
  months: { type: Number, required: true },
  monthlyAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  interestRate: { type: Number, default: 0 }
}, { _id: true });

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  price: { type: Number, required: true },
  image: String
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true, lowercase: true },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  discount: Number,
  variants: [variantSchema],
  emiPlans: [emiPlanSchema],
  specifications: { type: Map, of: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
