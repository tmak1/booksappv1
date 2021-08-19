import jwt from 'jsonwebtoken';

export const checkAuth = (req) => {
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      if (
        !token ||
        token === '' ||
        token === undefined ||
        token === 'undefined'
      ) {
        throw new Error('Could not get token', 500);
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return {
        loggedInUserId: decoded.userId,
        token,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};
