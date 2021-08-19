import React, { useState, useEffect, useContext, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import ErrorModal from '../../shared/ui/ErrorModal';
import TextError from '../../shared/form/TextError';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';
import Preview from './Preview';
import { AuthContext } from '../../shared/context/AuthContext';

import './SignupForm.css';

export default function SignupForm() {
  const auth = useContext(AuthContext);
  const filePickerRef = useRef();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const initialValues = {
    name: '',
    email: '',
    password: '',
    image: null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name required!'),
    email: Yup.string().email('Invalid Email!').required('Email required!'),
    password: Yup.string()
      .min(3, 'Must be 3 atleast characters!')
      .required('Password required!'),
    image: Yup.mixed().required('Profile image required!'),
  });

  const submitHandler = async (values, onSubmitProps) => {
    // console.log('VALUES!!! ', values);
    try {
      setLoading(true);
      var formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('image', values.image);

      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/signup`, {
        method: 'POST',

        body: formData,
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        throw new Error(data.message);
      }
      console.log(data);
      auth.login(data.user, data.token);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setErr(error.message || 'An unknown error occured');
    } finally {
      onSubmitProps.setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }
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
                <label htmlFor="name">Name</label>
                <Field className="field" type="text" id="name" name="name" />
                <ErrorMessage component={TextError} name="name" />
              </div>
              <div className="form-control">
                {formik.values.image ? (
                  <Preview file={formik.values.image} />
                ) : (
                  <p>Please pick an image</p>
                )}
                <input
                  id="image"
                  name="image"
                  type="file"
                  ref={filePickerRef}
                  style={{ display: 'none' }}
                  accept=".jpg, .jpeg, .png"
                  onChange={(event) => {
                    formik.setFieldValue('image', event.currentTarget.files[0]);
                  }}
                />
                <button
                  className="image-picker__btn"
                  type="button"
                  onClick={() => {
                    filePickerRef.current.click();
                  }}
                >
                  PICK IMAGE
                </button>
                <ErrorMessage component={TextError} name="image" />
              </div>
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
              SIGNUP
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}
