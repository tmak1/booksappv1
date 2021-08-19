import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import BookList from './BookList';
import BookDetailsContainer from './BookDetailsContainer';
import NewBookForm from '../pages/NewBookForm';
import SearchBook from './SearchBook';

import { AuthContext } from '../../shared/context/AuthContext';

import './BookContainer.css';

export default function BookContainer({ books }) {
  const history = useHistory();
  console.log(history.location.pathname.split('/')[2]);
  const auth = useContext(AuthContext);
  const [formOpen, setFormOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState();

  const [searchTerm, setSearchTerm] = useState(
    JSON.parse(localStorage.getItem('bookSearchTerm'))?.searchTerm || ''
  );

  const showDetailsHandler = (book) => {
    setCurrentBook(book);
  };
  const toggleForm = () => {
    setFormOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (!currentBook && books.length > 0) {
      setCurrentBook(books[0]);
    }
  }, [books]);

  // console.log('rendering container..');
  return (
    <div className="main-container">
      <div className="titles-container">
        <div className="page-title">
          <PageTitle
            word={
              history.location.pathname === '/'
                ? 'All'
                : history.location.pathname.split('/')[2] === auth.user.id
                ? 'Your'
                : "Other's"
            }
          />
          <SearchBook
            searchTerm={searchTerm}
            searchHandler={(value) => {
              setSearchTerm(value);
              localStorage.setItem(
                'bookSearchTerm',
                JSON.stringify({ searchTerm: value })
              );
            }}
          />
        </div>

        {books && currentBook && (
          <BookList
            books={books}
            currentBookId={currentBook?.id}
            showDetailsHandler={showDetailsHandler}
            searchTerm={searchTerm}
          />
        )}
        {formOpen ? (
          <NewBookForm
            showDetailsHandler={showDetailsHandler}
            toggleForm={toggleForm}
          />
        ) : null}
        {auth.token && (
          <button className="form-open-btn" onClick={toggleForm}>
            +
          </button>
        )}
      </div>
      <div className="details-container">
        {currentBook && (
          <BookDetailsContainer
            book={currentBook}
            showDetailsHandler={showDetailsHandler}
          />
        )}
      </div>
    </div>
  );
}
