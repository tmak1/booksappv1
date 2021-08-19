import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

import HttpError from '../shared/errormodel/HttpError.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      length: { min: 3 },
      required: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    next();
  } catch (error) {
    console.log(error);
    throw error;
  }
});

userSchema.statics.findByCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new HttpError('Incorrect email/password', 401);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpError('Incorrect email/password', 401);
    }
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

userSchema.methods.getAuthToken = function () {
  try {
    const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    if (!token) {
      throw new HttpError('Could not create token', 500);
    }
    return token;
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('user', userSchema);

export default User;
