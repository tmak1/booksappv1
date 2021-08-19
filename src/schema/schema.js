import { gql } from 'apollo-server-express';

import bookTypeDefs from './typeDefs/bookTypes.js';
import authorTypeDefs from './typeDefs/authorTypes.js';
import userTypeDefs from './typeDefs/userTypes.js';

import {
  findAllUsers,
  findUserById,
  findUserWhoCreatedBook,
} from './resolvers/userResolvers.js';

import {
  findAllBooks,
  findBookById,
  findBooksOfAuthor,
  findBooksOfUser,
  createBook,
  editBook,
  deleteBook,
} from './resolvers/bookResolvers.js';

import {
  findAllAuthors,
  findAuthorById,
  findAuthorOfBook,
  createAuthor,
} from './resolvers/authorResolvers.js';

export const typeDefs = gql`
  ${bookTypeDefs}
  ${authorTypeDefs}
  ${userTypeDefs}

  type Query {
    users: [User]!
    user(id: ID!): User!
    books: [Book]!
    book(id: ID!): Book!
    authors: [Author]!
    author(id: ID!): Author!
  }

  type Mutation {
    createBook(bookInputs: BookInputs!): Book!
    editBook(bookInputs: BookInputs!, id: ID!): Book!
    deleteBook(id: ID!): Book!
    createAuthor(authorInputs: AuthorInputs!): Author!
  }
`;

export const resolvers = {
  Query: {
    users: findAllUsers,
    user: findUserById,
    books: findAllBooks,
    book: findBookById,
    authors: findAllAuthors,
    author: findAuthorById,
  },
  User: {
    books: findBooksOfUser,
  },
  Book: {
    user: findUserWhoCreatedBook,
    author: findAuthorOfBook,
  },
  Author: {
    books: findBooksOfAuthor,
  },
  Mutation: {
    createBook: createBook,
    editBook: editBook,
    deleteBook: deleteBook,
    createAuthor: createAuthor,
  },
};
