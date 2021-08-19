import { createContext } from 'react';

export const AuthContext = createContext({
  user: {},
  token: '',
  login: () => {},
  logout: () => {},
});
