import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, makeReference } from '@apollo/client';

import { GET_BOOK_DETAILS, DELETE_BOOK } from '../../../gqlQueries/bookQueries';
import EditBookForm from '../pages/EditBookForm';
import ErrorModal from '../../shared/ui/ErrorModal';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';

import BookItem from './BookItem';

export default function BookDetailsContainer({ book, showDetailsHandler }) {
  const [showEditBookForm, setShowEditBookForm] = useState(false);
  const [err, setErr] = useState();

  const [bookItem, setBookItem] = useState();

  const [deleteBook] = useMutation(DELETE_BOOK, {
    onCompleted: (res) => {},
    onError: (error) => {
      console.log(error);
      setErr(error.message || 'An unknown error occured');
    },
    update: (cache, { data }) => {
      try {
        if (!data.deleteBook) {
          throw new Error('Could not remove author from cache');
        }
        const bookId = data.deleteBook.id;
        const userId = data.deleteBook.user.id;
        const authorId = data.deleteBook.author.id;
        const normalizedId = cache.identify({
          id: bookId,
          __typename: 'Book',
        });
        try {
          cache.modify({
            id: cache.identify({
              __typename: 'User',
              id: userId,
            }),
            fields: {
              books: (existingBooks, { readField }) => {
                return existingBooks.filter(
                  (book) => readField('id', book) !== bookId
                );
              },
            },
          });
        } catch (error) {
          console.log(error);
          throw error;
        }

        try {
          cache.modify({
            id: cache.identify({
              __typename: 'Author',
              id: authorId,
            }),
            fields: {
              books: (existingBooks, { readField }) => {
                return existingBooks.filter(
                  (book) => readField('id', book) !== bookId
                );
              },
            },
          });
        } catch (error) {
          console.log(error);
          throw error;
        }

        try {
          cache.modify({
            id: cache.identify(makeReference('ROOT_QUERY')),
            fields: {
              book: (existingBook, { DELETE, readField }) => {
                return readField('id', existingBook) === bookId
                  ? DELETE
                  : existingBook;
              },
              books: (existingBooks, { readField }) => {
                return existingBooks.filter(
                  (book) => readField('id', book) !== bookId
                );
              },
            },
          });
        } catch (error) {
          console.log(error);
        }
        cache.evict({ id: normalizedId });
        cache.gc();
      } catch (error) {
        console.log(error);
        setErr(error.message || 'An uknown error occured');
      } finally {
        showDetailsHandler(null);
      }
    },
  });

  const deleteBookHandler = (bookId) => {
    deleteBook({
      variables: {
        bookId,
      },
    })
      .then((res) => {
        //setSkip(true);
        // console.log(client.data.data);
      })
      .catch((error) => {
        console.log(error);
        setErr(error.message || 'An unknown error occured');
      });
  };

  const editBookHandler = (editedBook) => {
    setShowEditBookForm(false);
    setBookItem(editedBook);
  };

  const { loading } = useQuery(GET_BOOK_DETAILS, {
    variables: { bookId: book?.id },
    onCompleted: (data) => {
      // console.log('LAZY QUERY CALLED!!!');
      setBookItem(data?.book);
    },
    onError: (error) => {
      console.log(error);
      setErr(error.message || 'An unknown error occured');
    },
  });

  useEffect(() => {
    return () => {
      if (showEditBookForm !== null) {
        setShowEditBookForm(null);
      }
    };
  }, []);

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
        <LoadingSpinner />
      </div>
    );
  }

  if (!bookItem) {
    // console.log('I M HEREE');
    return (
      <div className="center">
        <h2>No book selected</h2>
      </div>
    );
  }

  return bookItem ? (
    !showEditBookForm ? (
      <BookItem
        book={bookItem}
        deleteBookHandler={deleteBookHandler}
        showEditBookForm={setShowEditBookForm}
      />
    ) : (
      <EditBookForm
        book={bookItem}
        showEditBookForm={setShowEditBookForm}
        editBookHandler={editBookHandler}
      />
    )
  ) : null;
}
