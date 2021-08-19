import mdbConn from '../src/shared/db/mongodb.js';
import users from './users.js';
import books from './books.js';
import authors from './authors.js';
import User from '../src/models/user.js';
import Book from '../src/models/book.js';
import Author from '../src/models/author.js';

import { printCounts } from './seedHelpers.js';

const clearDb = async (deleteOperation = false) => {
  try {
    const { deletedCount: users } = await User.deleteMany({});
    const { deletedCount: authors } = await Author.deleteMany({});
    const { deletedCount: books } = await Book.deleteMany({});
    const deleted = printCounts(users, authors, books);
    console.log(`Data destroyed!\n${deleted}`);
    if (deleteOperation) {
      process.exit(0);
    }
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await clearDb();

    // ----- AUTHORS -------
    const createdAuthors = await Author.insertMany(authors);

    // ----- USERS -------

    const createdUsers = await User.insertMany(users);
    const booka = {
      ...books[1],
      authorId: createdAuthors[1]._id,
      userId: createdUsers[1]._id,
    };
    console.log(booka);

    // ----- BOOKS -------
    const sampleBooks = [
      {
        ...books[0],
        authorId: createdAuthors[0]._id,
        userId: createdUsers[0]._id,
      },
      {
        ...books[1],
        authorId: createdAuthors[1]._id,
        userId: createdUsers[1]._id,
      },
      {
        ...books[2],
        authorId: createdAuthors[2]._id,
        userId: createdUsers[0]._id,
      },
    ];
    const createdBooks = await Book.insertMany(sampleBooks);

    // ----------------------- X ------------------------------

    const inserted = printCounts(
      createdUsers.length,
      createdAuthors.length,
      createdBooks.length
    );
    console.log(`Data imported!${inserted}`);
    process.exit(0);
  } catch (error) {
    console.log(`${error}`);
    process.exit(1);
  }
};

try {
  await mdbConn();
  if (process.argv[0] === '-d') {
    console.log('Deleting..');
    await clearDb(true);
  } else {
    console.log('Deleting/Inserting..');
    await importData();
  }
} catch (error) {
  console.log(error);
}
