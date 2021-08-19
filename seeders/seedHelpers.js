import mongoose from 'mongoose';

export const printCounts = (users, books, authors) => {
  return JSON.stringify(
    {
      count: {
        users,
        books,
        authors,
      },
    },
    null,
    2
  );
};

export const randomObjectId = () => {
  return mongoose.Types.ObjectId();
};
