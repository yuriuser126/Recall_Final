// layout/MainLayout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../assets/Global.css'; // 전역 스타일 적용

function MainLayout({ children }) {
  return (
    <div>
      <Header />
      <main style={{ padding: '20px' }}>{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;