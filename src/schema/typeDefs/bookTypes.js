import { gql } from 'apollo-server-express';

const bookTypeDefs = gql`
  type Book {
    id: ID!
    title: String!
    genre: String!
    summary: String!
    user: User!
    author: Author!
  }

  input BookInputs {
    title: String!
    genre: String!
    summary: String
    authorId: ID!
  }
`;

export default bookTypeDefs;
