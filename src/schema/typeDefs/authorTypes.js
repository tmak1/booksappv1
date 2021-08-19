import { gql } from 'apollo-server-express';

const authorTypeDefs = gql`
  type Author {
    id: ID!
    name: String!
    age: Int!
    books: [Book]!
  }

  input AuthorInputs {
    name: String!
    age: Int!
  }
`;

export default authorTypeDefs;
