// components/MenuItem.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuItem.css'; // 필요에 따라 스타일 추가

function MenuItem({ item }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    if (item.children) { // 자식 메뉴가 있을 때만 드롭다운 상태 변경
      setIsDropdownOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (item.children) {
      setIsDropdownOpen(false);
    }
  };

  return (
    <li
      className={`nav-item ${item.children ? 'dropdown' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={item.link || '#'} className={item.children ? 'dropdown-toggle' : ''}>
        <span>{item.label}</span>
        {item.children && <i className="bi bi-chevron-down toggle-dropdown"></i>}
      </Link>

      {item.children && isDropdownOpen && (
        <ul className="dropdown-menu">
          {item.children.map((child, index) => (
            <li key={index}>
              <Link to={child.link}>{child.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default MenuItem;