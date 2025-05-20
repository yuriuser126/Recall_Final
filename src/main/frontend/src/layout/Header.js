// layout/Header.js
import React from 'react';
import logo from '../assets/logo.png'; // 이미지 import

function Header() {
  return (
    <header style={{ backgroundColor: '#333', color: 'white', padding: '10px' }}>
      <img src={logo} alt="Logo" style={{ height: '30px', marginRight: '10px' }} />
      <h1>My Awesome App</h1>
    </header>
  );
}

export default Header;