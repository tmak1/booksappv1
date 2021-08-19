import React from 'react';

export default function AuthorBookList({ author }) {
  return (
    <>
      <em>Author:</em>
      <h3 className="capitalize">{author.name}</h3>
      <ul className="book-item__books-list">
        <em>Books:</em>
        {author.books.map(({ id, title }) => {
          return (
            <li key={id} className="capitalize">
              {title}
            </li>
          );
        })}
      </ul>
    </>
  );
}
