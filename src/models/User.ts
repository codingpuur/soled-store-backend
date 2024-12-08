import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string; //The user's first name.
  lastName: string; //The user's last name.
  email: string; //The user's email address.
  userType: string; //The type of user.
  gender: 'M' | 'F' | 'O'; //The user's gender.
  telephone: string; //The user's telephone number.
  birthdate: Date; //The user's birthdate.
  tssMoney: number; //The amount of TSS money the user has.
  tssPoints: number; //The amount of TSS points the user has.
  isTwoFa: boolean; //Specifies if two-factor authentication (2FA) is enabled. 1 means it is enabled.
  cashback: number; //The amount of cashback the user has earned.
  hasPassword: boolean; //Specifies if the user has a password. 1 means it has a password.
  zoneId: number; //The ID of the zone associated with the user's account.
  createdAt: Date; //The date and time when the user's account was created.
  updatedAt: Date; //The date and time when the user's account was last updated.
  birthdateUpdatedAt?: Date; //The date and time when the user's birthdate was last updated.
  disableBirthdate: boolean; //Specifies if the user's birthdate is disabled. 1 means it is disabled.
  nextTssMoneyToExpire: number; //The number of TSS money the user needs to earn to expire the next TSS money.  
  tssMoneyExpiry?: Date; //The date and time when the user's TSS money will expire.
  nextTssPointToExpire: number; //The number of points the user needs to earn to expire the next TSS point.
  tssPointExpiry?: Date; //The date and time when the user's TSS point will expire.
  validTokenCount: number; //The number of valid login or authentication tokens associated with the user's account.
  orderCount: number; //The number of orders associated with the user's account.
  eventId: string; //The ID of the event associated with the user's account.
  totalSpending: number; //The total amount of money spent by the user.
  successfulOrders: number; //The number of successful orders associated with the user's account.
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  wallet: number;
}

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  userType: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['M', 'F', 'O'],
    required: true
  },
  telephone: {
    type: String,
    default: ''
  },
  birthdate: {
    type: Date,
    default: null
  },
  tssMoney: {
    type: Number,
    default: 0
  },
  tssPoints: {
    type: Number,
    default: 0
  },
  isTwoFa: {
    type: Boolean,
    default: false
  },
  cashback: {
    type: Number,
    default: 0
  },
  hasPassword: {
    type: Boolean,
    default: false
  },
  zoneId: {
    type: Number,
    default: null
 
  },
  birthdateUpdatedAt: {
    type: Date,
    default: null
  },
  disableBirthdate: {
    type: Boolean,
    default: false
  },
  nextTssMoneyToExpire: {
    type: Number,
    default: 0
  },
  tssMoneyExpiry: {
    type: Date,
    default: null
  },
  nextTssPointToExpire: {
    type: Number,
    default: 0
  },
  tssPointExpiry: {
    type: Date,
    default: null
  },
  validTokenCount: {
    type: Number,
    default: 0
  },
  orderCount: {
    type: Number,
    default: 0
  },
  eventId: {
    type: String
  },
  totalSpending: {
    type: Number,
    default: 0
  },
  successfulOrders: {
    type: Number,
    default: 0
  },
  password: {
    type: String,
    required: true
  },
  wallet: { type: Number, default: 0 },
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);