// components/MenuItem.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuItem.css';

const MenuItem = ({ item }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    if (item.children) setIsDropdownOpen(true);
  };
  const handleMouseLeave = () => {
    if (item.children) setIsDropdownOpen(false);
  };

  return (
    <li
      className={`nav-item${item.children ? ' dropdown' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={item.link || '#'} className={item.children ? 'dropdown-toggle' : ''}>
        <span>{item.label}</span>
        {item.children && <i className="bi bi-chevron-down toggle-dropdown"></i>}
      </Link>
      {item.children && isDropdownOpen && (
        <ul className="dropdown-menu">
          {item.children.map((child, idx) => (
            <li key={idx}>
              <Link to={child.link}>{child.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuItem;