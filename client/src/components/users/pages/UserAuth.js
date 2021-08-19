import React, { useState, useEffect, useCallback, createRef } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

import './UserAuth.css';

export default function UserAuth() {
  const [loginMode, setLoginMode] = useState(true);
  const ref = createRef();

  const clickOnLoad = useCallback(() => {
    ref.current.focus();
  }, [ref]);

  useEffect(() => {
    clickOnLoad();
  }, [clickOnLoad]);

  return (
    <div className="auth-tab">
      <div className="auth-tab__btn">
        <button
          onClick={() => {
            setLoginMode(true);
          }}
          ref={ref}
        >
          Login
        </button>
        <button
          onClick={() => {
            setLoginMode(false);
          }}
        >
          Signup
        </button>
      </div>
      {loginMode ? <LoginForm /> : <SignupForm />}
    </div>
  );
}
