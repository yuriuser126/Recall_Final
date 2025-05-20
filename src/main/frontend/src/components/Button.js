// components/Button.js
import React from 'react';
import './Button.css'; // components/Button.css

function Button({ onClick, children }) {
  return (
    <button className="my-button" onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;