import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../shared/context/AuthContext';

import './NavLinks.css';

export default function NavLinks() {
  const auth = useContext(AuthContext);
  return (
    <ul>
      <li>
        <NavLink activeClassName="selected" exact to="/">
          ALL BOOKS
        </NavLink>
      </li>
      {auth.token && auth.user && auth.user.id && (
        <li>
          <NavLink activeClassName="selected" to={`/users/${auth.user.id}`}>
            MY BOOKS
          </NavLink>
        </li>
      )}
      {!auth.token && (
        <li>
          <NavLink activeClassName="selected" to="/login">
            AUTH
          </NavLink>
        </li>
      )}
      {auth.token && (
        <li>
          <button
            to=""
            onClick={() => {
              auth.logout();
            }}
          >
            LOGOUT
          </button>
        </li>
      )}
    </ul>
  );
}
