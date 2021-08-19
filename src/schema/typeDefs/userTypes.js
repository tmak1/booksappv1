import { gql } from 'apollo-server-express';

const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    books: [Book]!
  }
`;

export default userTypeDefs;
