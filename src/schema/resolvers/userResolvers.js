import User from '../../models/user.js';

export const findAllUsers = async () => {
  let users;
  try {
    users = await User.find({});
    return users || [];
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const findUserById = async (parent, { id }) => {
  let user;
  try {
    user = await User.findById(id);
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const findUserWhoCreatedBook = async ({ userId }) => {
  let user;
  try {
    user = await User.findById(userId);
    if (!user) {
      throw new HttpError('Could not find user', 404);
    }
    return user;
  } catch (error) {
    console.log(error);
    return error;
  }
};
