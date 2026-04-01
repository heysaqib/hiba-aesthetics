import mongoose, { Schema, model, models } from 'mongoose';

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
    select: false, // Don't return password by default
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);

export default User;
