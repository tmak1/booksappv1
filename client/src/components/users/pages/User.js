import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { GET_USER_DETAILS } from '../../../gqlQueries/userQueries';
import BookContainer from '../../books/components/BookContainer';
import ErrorModal from '../../shared/ui/ErrorModal';
import LoadingSpinner from '../../shared/ui/LoadingSpinner';

export default function User() {
  const userId = useParams().uid;
  const [err, setErr] = useState();
  const { loading, data } = useQuery(GET_USER_DETAILS, {
    variables: {
      userId,
    },
    onError: (error) => {
      console.log(error);
      setErr(error.message || 'An unknown error occured');
    },
  });

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

  // console.log('rendering user..');

  return <BookContainer books={data && data.user ? data.user.books : []} />;
}
