import mongoose, { Document, Schema } from 'mongoose';

export interface OrderItem {
  product: mongoose.Types.ObjectId;
  
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    address1: string;
    address2?: string;
    address3?: string;
    city: string;
    state: string;
    postcode: string;
    phoneNo: string;
    addressType: 'HOME' | 'OFFICE';
    isDefault: boolean;
  };
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentIntentId?: string;
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  couponApplied?: mongoose.Types.ObjectId;
  discountAmount: number;
}

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      // type: Schema.Types.ObjectId,
      type: String,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String },
    address3: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postcode: { type: String, required: true },
    phoneNo: { type: String, required: true },
    addressType: { 
      type: String,
      enum: ['HOME', 'OFFICE'],
      required: true
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  couponApplied: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  discountAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model<IOrder>('Order', orderSchema);