import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
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
  user: mongoose.Types.ObjectId;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  address1: {
    type: String,
    required: true,
    trim: true
  },
  address2: {
    type: String,
    trim: true
  },
  address3: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  postcode: {
    type: String,
    required: true,
    trim: true
  },
  phoneNo: {
    type: String,
    required: true,
    trim: true
  },
  addressType: {
    type: String,
    enum: ['HOME', 'OFFICE'],
    default: 'HOME'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add compound index for user and isDefault to efficiently query default addresses
AddressSchema.index({ user: 1, isDefault: 1 });

export default mongoose.model<IAddress>('Address', AddressSchema);
