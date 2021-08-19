import { gql } from '@apollo/client';

const Author_Fragment = gql`
  fragment authorFragment on Author {
    id
    name
    books {
      id
      title
    }
  }
`;

const User_Fragment = gql`
  fragment userFragment on User {
    id
    name
    email
  }
`;

export const GET_ALL_BOOKS = gql`
  query getAllBooks {
    books {
      id
      title
    }
  }
`;

export const GET_BOOK_DETAILS = gql`
  ${Author_Fragment}
  ${User_Fragment}
  query getBookDetails($bookId: ID!) {
    book(id: $bookId) {
      id
      title
      genre
      summary
      author {
        ...authorFragment
      }
      user {
        ...userFragment
      }
    }
  }
`;

export const CREATE_BOOK = gql`
  ${Author_Fragment}
  ${User_Fragment}
  mutation createBook($bookInputs: BookInputs!) {
    createBook(bookInputs: $bookInputs) {
      id
      title
      genre
      summary
      author {
        ...authorFragment
      }
      user {
        ...userFragment
      }
    }
  }
`;

export const EDIT_BOOK = gql`
  ${Author_Fragment}
  ${User_Fragment}
  mutation editBook($bookInputs: BookInputs!, $bookId: ID!) {
    editBook(bookInputs: $bookInputs, id: $bookId) {
      id
      title
      genre
      summary
      author {
        ...authorFragment
      }
      user {
        ...userFragment
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  ${Author_Fragment}
  ${User_Fragment}
  mutation deleteBook($bookId: ID!) {
    deleteBook(id: $bookId) {
      id
      title
      author {
        ...authorFragment
      }
      user {
        ...userFragment
      }
    }
  }
`;
