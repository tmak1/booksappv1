import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query getAllUsers {
    users {
      id
      email
    }
  }
`;

export const GET_USER_DETAILS = gql`
  query getUserDetails($userId: ID!) {
    user(id: $userId) {
      id
      name
      email
      books {
        id
        title
      }
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation signup($userInputs: UserInputs!) {
    signup(userInputs: $userInputs) {
      user {
        id
        email
      }
      token
    }
  }
`;

export const LOGIN_USER = gql`
  query login($loginInputs: LoginInputs!) {
    login(loginInputs: $loginInputs) {
      user {
        id
        email
      }
      token
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($userId: ID!) {
    deleteUser(id: $userId) {
      id
      name
      email
    }
  }
`;
