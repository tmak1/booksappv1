import mongoose from 'mongoose';

import User from '../../models/user.js';
import Book from '../../models/book.js';

export const findAllBooks = async () => {
  let books;
  try {
    books = await Book.find({});
    if (!books) {
      throw new HttpError('Could not find books', 404);
    }
    return books;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const findBookById = async (parent, { id }) => {
  let book;
  try {
    book = await Book.findById(id);
    if (!book) {
      throw new HttpError('Could not find book', 401);
    }
    return book;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const findBooksOfAuthor = async ({ id }) => {
  let books;
  try {
    books = await Book.find({ authorId: id });
    if (!books) {
      throw new HttpError('Could not find books for that author', 404);
    }
    return books;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const findBooksOfUser = async ({ id }) => {
  let books;
  try {
    books = await Book.find({ userId: id });
    if (!books) {
      throw new HttpError('Could not find books for that user', 404);
    }
    return books;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createBook = async (
  parent,
  { bookInputs: { title, genre, summary, authorId } },
  { loggedInUserId, token }
) => {
  let book;
  try {
    if (!loggedInUserId) {
      throw new HttpError('Unauthenticated', 422);
    }
    const bookExists = await Book.findOne({ title });
    if (bookExists) {
      throw new HttpError('That book already exists', 422);
    }
    const user = await User.findById(loggedInUserId);
    if (!user) {
      throw new HttpError('The user does not exist', 404);
    }

    book = new Book({
      title,
      genre,
      summary,
      userId: loggedInUserId,
      authorId,
    });
    book = await book.save();
    if (!book) {
      throw new HttpError('Could not create book', 500);
    }

    return book;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const editBook = async (
  parent,
  { bookInputs: { title, genre, summary, authorId }, id },
  { loggedInUserId, token }
) => {
  let book;
  try {
    if (!loggedInUserId) {
      throw new HttpError('Unauthenticated', 422);
    }
    book = await Book.findById(id).populate('userId');
    if (!book) {
      throw new HttpError('That book does not exist', 422);
    }
    if (book.userId._id.toString() !== loggedInUserId) {
      throw new HttpError('Unathorized', 422);
    }

    book.title = title;
    book.genre = genre;
    book.summary = summary;
    book.authorId = authorId;
    book = await book.save();
    if (!book) {
      throw new HttpError('Could not update book', 500);
    }

    return book;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteBook = async (parent, { id }, { loggedInUserId, token }) => {
  let book;
  try {
    book = await Book.findById(id);
    if (!book) {
      throw new HttpError('That book does not exist', 404);
    }
    if (book.userId._id.toString() !== loggedInUserId) {
      throw new HttpError('Unathorized', 422);
    }

    const deletedBook = await book.remove();
    if (!deletedBook) {
      throw new HttpError('Could not delete book', 500);
    }

    return deletedBook;
  } catch (error) {
    console.log(error);
    return error;
  }
};
