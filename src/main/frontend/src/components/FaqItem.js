// components/FaqItem.js
import React, { useState } from 'react';
import './FaqItem.css'; // FaqItem 전용 CSS 파일

function FaqItem({ item }) {
  const [isOpen, setIsOpen] = useState(false); // 답변 공개/숨김 상태

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`faq-item ${isOpen ? 'active' : ''}`}>
      <h3 onClick={toggleOpen} style={{ cursor: 'pointer' }}>
        <img src="/assets/qna.png" alt="Q" style={{ width: '24px', height: '24px', verticalAlign: 'middle', marginRight: '8px' }} />
        <span>{item.question}</span>
        <i className={`faq-toggle bi ${isOpen ? 'bi-chevron-down' : 'bi-chevron-right'}`}></i>
      </h3>
      <div className="faq-content" style={{ display: isOpen ? 'block' : 'none' }}>
        <p>{item.answer}</p>
      </div>
    </div>
  );
}

export default FaqItem;