import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { EDIT_BOOK } from '../../../gqlQueries/bookQueries';
import AuthorSelectInput from '../components/AuthorSelectInput';
import ErrorModal from '../../shared/ui/ErrorModal';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';
import TextError from '../../shared/form/TextError';

import './EditBookForm.css';

export default function EditBookForm({
  book,
  editBookHandler,
  showEditBookForm,
}) {
  const [err, setErr] = useState();
  const [editBook, { loading }] = useMutation(EDIT_BOOK, {
    onError: (error) => {
      console.log(error);
      setErr(error.message || 'An unknown error occured');
    },
    update: (cache, { data }) => {
      const editedBook = data.editBook;
      if (!editedBook) {
        throw new Error();
      }
      if (editedBook.author.id === book.author.id) {
        return;
      }
      // console.log(cache.data.data);
      try {
        try {
          cache.modify({
            id: cache.identify({
              __typename: 'Author',
              id: book.author.id,
            }),
            fields: {
              books: (existingBooks, { readField }) => {
                return existingBooks.filter(
                  (book) => readField('id', book) !== editedBook.id
                );
              },
            },
          });
        } catch (error) {
          console.log(error);
          throw error;
        }
      } catch (error) {
        console.log(error);
        setErr(error.message || 'An unknown error occured');
      }
    },
  });

  const initialValues = {
    title: book.title,
    genre: book.genre,
    summary: book.summary,
    authorId: book.author.id,
  };
  //console.log('rendering editbookform');
  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title required!'),
    genre: Yup.string().required('Genre required!'),
    summary: Yup.string().required('Summary required!'),
    authorId: Yup.string().required('Author required!'),
  });

  const submitHandler = (values, onSubmitProps) => {
    //console.log('VALUES!!! ', values);
    onSubmitProps.setSubmitting(false);
    editBook({
      variables: {
        bookInputs: {
          title: values.title,
          genre: values.genre,
          summary: values.summary,
          authorId: values.authorId,
        },
        bookId: book.id,
      },
    })
      .then(({ data }) => {
        editBookHandler(data.editBook);
      })
      .catch((error) => {
        console.log(error);
        setErr(error.message || 'An unknown error occured');
      });
  };

  //   console.log('rendering  editbookform..');
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
    <div className="edit-book-item">
      <p>Edit Book Details</p>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={submitHandler}
        validateOnMount
      >
        {(formik) => {
          return (
            <Form>
              <div className="edit-book-item__book">
                <div className="field">
                  <label htmlFor="title">
                    <em>Title</em>
                  </label>
                  <Field
                    className="title"
                    type="text"
                    id="title"
                    name="title"
                  />
                  <TextError editBook>
                    <ErrorMessage name="title" />
                  </TextError>
                </div>
                <div className="field">
                  <label htmlFor="genre">
                    <em>Genre</em>
                  </label>
                  <Field
                    className="genre"
                    type="text"
                    id="genre"
                    name="genre"
                  />
                  <TextError editBook>
                    <ErrorMessage name="genre" />
                  </TextError>
                </div>
                <div className="field">
                  <label htmlFor="summary">
                    <em>Summary</em>
                  </label>
                  <Field
                    className="summary"
                    type="text"
                    id="summary"
                    name="summary"
                    as="textarea"
                  />
                  <TextError editBook>
                    <ErrorMessage name="summary" />
                  </TextError>
                </div>
              </div>
              <div className="edit-book-item__author field">
                <AuthorSelectInput />
              </div>
              <button
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                SAVE
              </button>
              <button type="button" onClick={() => showEditBookForm(false)}>
                CANCEL
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
