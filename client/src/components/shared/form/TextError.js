import React from 'react';

export default function TextError(props) {
  return (
    <div
      style={{ color: !props.editBook ? 'red' : 'whitesmoke', margin: '15px' }}
    >
      {props.children}
    </div>
  );
}
