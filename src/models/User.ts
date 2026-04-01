import mongoose, { Schema, model, models } from 'mongoose';

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
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default User;
