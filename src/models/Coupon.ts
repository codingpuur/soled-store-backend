import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  discount: number;
  validUntil: Date;
  minimumPurchase: number;
  isActive: boolean;
}

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  discount: {
    type: Number,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  minimumPurchase: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ICoupon>('Coupon', couponSchema);