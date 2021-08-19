import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { useQuery } from '@apollo/client';

import { GET_ALL_AUTHORS } from '../../../gqlQueries/authorQueries';

import TextError from '../../shared/form/TextError';

export default function AuthorSelectInput() {
  const { data } = useQuery(GET_ALL_AUTHORS);
  return (
    <>
      <label htmlFor="authorId">Authors</label>
      <Field as="select" name="authorId" id="authorId" className="select-css">
        <option value="">Select author</option>
        {data &&
          data.authors.map((author) => {
            return (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            );
          })}
      </Field>
      <ErrorMessage component={TextError} name="authorId" />
    </>
  );
}
