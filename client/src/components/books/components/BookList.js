import React from 'react';

import Card from '../../shared/ui/Card';

import './BooksList.css';

export default function BookList({
  books,
  currentBookId,
  showDetailsHandler,
  searchTerm,
}) {
  // console.log('rendering list..');

  return books && books.length > 0 ? (
    <ul className="books-list">
      {books &&
        books
          .filter((book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((book) => {
            return (
              <li key={book.id} onClick={() => showDetailsHandler(book)}>
                <Card
                  active={
                    currentBookId && book.id === currentBookId ? ' active' : ''
                  }
                >
                  <div>{book.title[0].toUpperCase() + book.title.slice(1)}</div>
                </Card>
              </li>
            );
          })}
    </ul>
  ) : null;
}
