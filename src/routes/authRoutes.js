import express from 'express';
import { check, validationResult } from 'express-validator';

import User from '../models/user.js';
import HttpError from '../shared/errormodel/HttpError.js';
import { fileUploadUsers } from '../middleware/fileUpload.js';

const router = express.Router();

const login = async (req, res, next) => {
  let user;
  try {
    if (!validationResult(req).isEmpty()) {
      return next(new HttpError('Invalid input', 422));
    }
    const { email, password } = req.body;
    user = await User.findByCredentials(email, password);
    const token = user.getAuthToken();
    res.json({ user: user.toObject({ getters: true }), token });
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
};

const signup = async (req, res, next) => {
  let user;
  console.log('**********HERE*********');
  try {
    if (!validationResult(req).isEmpty()) {
      console.log(validationResult(req));
      return next(new HttpError('Invalid input', 422));
    }
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const imageFileName = req.file.path.split('/').slice(-1)[0];
    console.log(imageFileName);
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new HttpError('that email is already registered', 422);
    }
    if (!req.file) {
      throw new HttpError('Could not upload image', 500);
    }
    user = new User({
      name,
      email,
      password,
      imageUrl: imageFileName,
    });
    user = await user.save();
    if (!user) {
      throw new HttpError('Could not create that user', 500);
    }
    const token = user.getAuthToken();
    res.json({ user: user.toObject({ getters: true }), token });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

router
  .post(
    '/login',
    [check('email').isEmail(), check('password').isLength({ min: 3 })],
    login
  )
  .post(
    '/signup',
    fileUploadUsers.single('image'),
    [
      check('name').not().isEmpty(),
      check('email').isEmail(),
      check('password').isLength({ min: 3 }),
    ],
    signup
  );

export default router;
