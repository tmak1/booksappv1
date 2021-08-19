import React, { useState } from 'react';
import { useMutation, makeReference } from '@apollo/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { GET_BOOK_DETAILS, CREATE_BOOK } from '../../../gqlQueries/bookQueries';

import ErrorModal from '../../shared/ui/ErrorModal';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';
import TextError from '../../shared/form/TextError';

import './NewBookForm.css';
import AuthorSelectInput from '../components/AuthorSelectInput';

export default function NewBookForm({ showDetailsHandler, toggleForm }) {
  const [err, setErr] = useState();
  const initialValues = {
    title: '',
    genre: '',
    summary: '',
    authorId: '',
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title required!'),
    genre: Yup.string().required('Genre required!'),
    summary: Yup.string().required('Summary required!'),
    authorId: Yup.string().required('Author required!'),
  });

  const [createBook, { loading }] = useMutation(CREATE_BOOK, {
    update: (cache, { data }) => {
      console.log(cache.data.data);
      try {
        const newBook = data.createBook;
        if (!newBook) {
          throw new Error('No book from createBook');
        }
        try {
          cache.modify({
            id: cache.identify({
              __typename: 'User',
              id: newBook.user.id,
            }),
            fields: {
              books: (existingBooks, { toReference }) => {
                return [...existingBooks, toReference(newBook)];
              },
            },
          });
        } catch (error) {
          console.log(error);
        }
        try {
          cache.modify({
            id: cache.identify(makeReference('ROOT_QUERY')),
            fields: {
              books: (existingBooks, { toReference }) => {
                return [...existingBooks, toReference(newBook)];
              },
            },
          });
        } catch (error) {
          console.log(error);
        }
        try {
          cache.writeQuery({
            query: GET_BOOK_DETAILS,
            variables: { bookId: newBook.id },
            data: { book: newBook },
          });
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
        setErr(error.message || 'An uknown error occured');
      }
    },
  });
  // console.log('rendering  newbookform..');
  const submitHandler = (values, onSubmitProps) => {
    //console.log('VALUES!!! ', values);
    onSubmitProps.setSubmitting(false);
    createBook({
      variables: {
        bookInputs: {
          title: values.title,
          genre: values.genre,
          summary: values.summary,
          authorId: values.authorId,
        },
      },
    })
      .then(({ data: { createBook: newBook } }) => {
        showDetailsHandler(newBook);
        toggleForm((prevState) => !prevState);
      })
      .catch((error) => {
        console.log(error);
        setErr(error.message || 'An unknown error occured');
      });
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
          <Form className="book-form-container">
            <div className="book-form">
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <Field className="field" type="text" id="title" name="title" />
                <ErrorMessage component={TextError} name="title" />
              </div>
              <div>
                <div className="form-control">
                  <label htmlFor="genre">Genre</label>
                  <Field
                    className="field"
                    type="text"
                    id="genre"
                    name="genre"
                  />
                  <ErrorMessage component={TextError} name="genre" />
                </div>
              </div>
              <div className="form-control">
                <label htmlFor="summary">Summary</label>
                <Field
                  className="field"
                  type="text"
                  id="summary"
                  name="summary"
                />
                <ErrorMessage component={TextError} name="summary" />
              </div>
              <div>
                <div className="form-control">
                  <AuthorSelectInput />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              ADD BOOK
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}
