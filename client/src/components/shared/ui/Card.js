import React from 'react';
import './Card.css';

function Card(props) {
  return <div className={`card${props.active}`}>{props.children}</div>;
}

export default Card;
