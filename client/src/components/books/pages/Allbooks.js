import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

import { GET_ALL_BOOKS } from '../../../gqlQueries/bookQueries';

import BookContainer from '../components/BookContainer';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';
import ErrorModal from '../../shared/ui/ErrorModal';

export default function Allbooks() {
  const [err, setErr] = useState();
  const { loading, data } = useQuery(GET_ALL_BOOKS, {
    onError: (error) => {
      console.log(error);
      setErr(error.message || 'An unknown error occured');
    },
  });

  // console.log('rendering allbooks..');
  console.log(err);
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

  return <BookContainer books={data ? data.books : []} />;
}
