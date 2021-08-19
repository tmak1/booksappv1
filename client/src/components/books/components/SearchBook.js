import React from 'react';
import { Formik, Form, Field } from 'formik';

import './SearchBook.css';

export default function SearchBook({ searchHandler, searchTerm }) {
  const initialValues = {
    search: searchTerm || '',
  };
  const submitHandler = (values, onSubmitProps) => {
    console.log(values);
    onSubmitProps.setSubmitting(false);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={submitHandler}>
      {(formik) => {
        return (
          <Form className="search-form-container">
            <Field
              type="text"
              name="search"
              id="search"
              onKeyUp={() => {
                searchHandler(formik.values.search);
              }}
            />
          </Form>
        );
      }}
    </Formik>
  );
}
