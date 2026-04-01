import { Schema, model, models } from 'mongoose';

const AddressSchema = new Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: 'Pakistan' },
  isDefault: { type: Boolean, default: false },
});

const CartItemSchema = new Schema({
  id: { type: String, required: true },
  brand: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  selectedSize: { type: String },
  selectedColor: {
    id: { type: String },
    hex: { type: String },
    name: { type: String }
  },
  selectedDesign: { type: String },
});

const WishlistItemSchema = new Schema({
  id: { type: String, required: true },
  brand: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, required: true },
  selectedSize: { type: String },
  selectedColor: {
    id: { type: String },
    hex: { type: String },
    name: { type: String }
  },
  selectedDesign: { type: String },
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
  },
  mobileNumber: {
    type: String,
    required: [true, 'Please provide a mobile number'],
  },
  name: {
    type: String,
    default: '',
  },
  profileImage: {
    type: String,
    default: '',
  },
  addresses: [AddressSchema],
  cart: [CartItemSchema],
  wishlist: [WishlistItemSchema],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default User;
