import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../../shared/ui/Backdrop';
import Avatar from '../../shared/ui/Avatar';

import { AuthContext } from '../../shared/context/AuthContext';

import './MainNavigation.css';

export default function MainNavigation() {
  const auth = useContext(AuthContext);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };
  return (
    <div className="main-nav">
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <div className="menu-btn" onClick={openDrawerHandler}>
        <span />
        <span />
        <span />
      </div>
      <div className="user-item">
        <div>
          {auth.user && auth.user.email ? (
            <Link to={`/users/${auth.user.id}`}>
              <div className="title-space">
                {auth.user.imageUrl && (
                  <div className="title-space_image">
                    <Avatar
                      image={`${process.env.REACT_APP_API_URL}/uploads/${auth.user.imageUrl}`}
                      alt={auth.user.email}
                    />
                  </div>
                )}
                <div className="title-space_info">
                  <div>
                    <em>Logged in as </em>
                  </div>
                  <b>{auth.user.email}</b> at{' '}
                  <b>{new Date().toString().split(' ')[4]}</b>
                </div>
              </div>
            </Link>
          ) : (
            <h2 style={{ color: '#ad1457' }}>The Book App</h2>
          )}
        </div>
        <nav className="header-nav">
          <NavLinks />
        </nav>
      </div>
    </div>
  );
}
