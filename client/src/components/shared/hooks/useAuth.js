import { useState, useEffect, useCallback } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((u, tok, tokEx) => {
    setUser(u);
    setToken(tok);
    const tokenExp = tokEx || new Date(new Date().getTime() + 60 * 60 * 1000);
    setTokenExpirationDate(tokenExp);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        user: u,
        token: tok,
        tokenExpirationDate: tokenExp.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const { user, token, tokenExpirationDate } = JSON.parse(userData);
      if (
        user &&
        token &&
        tokenExpirationDate &&
        new Date(tokenExpirationDate) > new Date()
      ) {
        login(user, token, new Date(tokenExpirationDate));
      }
    }
  }, [login]);

  useEffect(() => {
    if (user && token && tokenExpirationDate) {
      const remainningtime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainningtime);
    } else {
      return logoutTimer ? clearTimeout(logoutTimer) : null;
    }
  }, [logout, user, token, tokenExpirationDate]);

  return { user, token, login, logout };
};
