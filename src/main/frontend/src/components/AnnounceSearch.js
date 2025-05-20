// components/AnnounceSearch.js
import React, { useState } from 'react';

function AnnounceSearch({ onSearch, initialType = '', initialKeyword = '' }) {
  const [type, setType] = useState(initialType);
  const [keyword, setKeyword] = useState(initialKeyword);

  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    onSearch({ type, keyword, pageNum: 1 }); // 검색 시 첫 페이지로 이동
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <select name="type" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">전체</option>
        <option value="T">제목</option>
        <option value="C">내용</option>
      </select>
      <input
        type="text"
        name="keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      <button type="submit">검색</button>
    </form>
  );
}

export default AnnounceSearch;