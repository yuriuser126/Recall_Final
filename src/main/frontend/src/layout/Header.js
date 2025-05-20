// layout/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import MenuItem from '../components/MenuItem'; // MenuItem 컴포넌트 import

// 메뉴 데이터를 배열로 정의 (더 관리하기 쉬움)
const menuItems = [
  { label: '리콜정보', link: '/recall_list' },
  {
    label: '결함신고',
    link: '#', // 드롭다운 부모는 링크 없이 #로 설정하거나, 첫 자식 링크로 설정
    children: [
      { label: '결함신고', link: '/defect_reports' },
      { label: '신고내역조회', link: '/defect_list' },
    ],
  },
  {
    label: '리콜센터',
    link: '#',
    children: [
      { label: '공지사항', link: '/announce' },
      { label: 'FAQ', link: '/notice' },
    ],
  },
  { label: '리콜통계', link: '/recall_statics_year' },
  {
    label: '관리자',
    link: '#',
    children: [
      { label: '리콜정보검수', link: '/defect_details_check' },
      { label: '공지사항작성', link: '/announce_write' },
    ],
  },
];

function Header() {
  return (
    <header style={{ backgroundColor: '#333', color: 'white', padding: '10px', display: 'flex', alignItems: 'center' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 style={{ margin: 0 }}>Recall center</h1>
      </Link>

      <nav id="navmenu" className="navmenu" style={{ marginLeft: 'auto' }}>
        <ul>
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} /> // MenuItem 컴포넌트 사용
          ))}
        </ul>
        <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
      </nav>
    </header>
  );
}

export default Header;