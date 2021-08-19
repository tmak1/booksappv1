import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../shared/context/AuthContext';
import AuthorBookList from './AuthorBookList';

import './BookItem.css';

export default function BookItem({
  book: { id, title, genre, summary, author, user },
  deleteBookHandler,
  showEditBookForm,
}) {
  const auth = useContext(AuthContext);
  return (
    <div className="book-item">
      <p>Details</p>
      <div className="book-item__book capitalize">
        <h2>{title}</h2>
        <div>
          <em>Genre:</em>
          <h3>{genre}</h3>
        </div>
        <div>
          <em>Summary:</em>
          <blockquote>{summary}</blockquote>
        </div>
      </div>
      <div className="book-item__author">
        <AuthorBookList author={author} />
      </div>
      <div className="book-item__btn-container">
        {auth.user && auth.user.id === user.id && (
          <button
            onClick={() => {
              showEditBookForm(true);
            }}
          >
            EDIT
          </button>
        )}
        {auth.user && auth.user.id === user.id && (
          <button
            onClick={() => {
              deleteBookHandler(id);
            }}
          >
            DELETE
          </button>
        )}
      </div>
      <div className="book-item__user">
        <em>
          <p>-Added By </p>
          <Link to={`/users/${user.id}`}>{user.email}</Link>
        </em>
      </div>
    </div>
  );
}
