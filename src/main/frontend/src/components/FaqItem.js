// components/FaqItem.js
import { useState } from 'react';
import './FaqItem.css';

const FaqItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((open) => !open);

  return (
    <div className={`faq-item${isOpen ? ' active' : ''}`}>
      <h3 onClick={toggleOpen} style={{ cursor: 'pointer' }}>
        <img src="/assets/qna.png" alt="Q" style={{ width: 24, height: 24, verticalAlign: 'middle', marginRight: 8 }} />
        <span>{item.question}</span>
        <i className={`faq-toggle bi ${isOpen ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
      </h3>
      <div className="faq-content" style={{ display: isOpen ? 'block' : 'none' }}>
        <p>{item.answer}</p>
      </div>
    </div>
  );
};

export default FaqItem;