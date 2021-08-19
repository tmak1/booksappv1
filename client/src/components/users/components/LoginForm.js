import React, { useState, useEffect, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import ErrorModal from '../../shared/ui/ErrorModal';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';
import TextError from '../../shared/form/TextError';
import { AuthContext } from '../../shared/context/AuthContext';

import './SignupForm.css';

export default function LoginForm() {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid Email!').required('Email required!'),
    password: Yup.string()
      .min(3, 'Must be atleast 3 characters!')
      .required('Password required!'),
  });

  const submitHandler = async (values, onSubmitProps) => {
    //console.log('VALUES!!! ', values);
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        throw new Error(data.message);
      }
      auth.login(data.user, data.token);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setErr(error.message || 'An unknown error occured');
    } finally {
      onSubmitProps.setSubmitting(false);
    }
  };

  if (err) {
    return (
      <ErrorModal
        error={err}
        onClear={() => {
          setErr(null);
        }}
      />
    );
  }
  if (loading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitHandler}
      validateOnMount
    >
      {(formik) => {
        return (
          <Form className="user-form">
            <div className="user-form-container">
              <div className="form-control">
                <label htmlFor="email">Email</label>
                <Field className="field" type="email" id="email" name="email" />
                <ErrorMessage component={TextError} name="email" />
              </div>
              <div className="form-control">
                <label htmlFor="password">Password</label>
                <Field
                  className="field"
                  type="password"
                  id="password"
                  name="password"
                />
                <ErrorMessage component={TextError} name="password" />
              </div>
            </div>
            <button
              type="submit"
              disabled={!formik.isValid && formik.isSubmitting}
            >
              LOGINS
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}
