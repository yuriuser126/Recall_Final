// components/AnnounceList.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate
import { formatDateTime } from '../utils/formatters';

function AnnounceList({ announcements, total }) {
  const navigate = useNavigate();

  const handleRowClick = (id) => {
    // Spring Boot의 announce_view?id=... 와 유사하게 React 라우터로 이동
    navigate(`/announce_view/${id}?total=${total}`);
  };

  if (!announcements || announcements.length === 0) {
    return <p>표시할 공지사항이 없습니다.</p>;
  }

  return (
    <table className="table-custom">
      <thead>
        <tr>
          <th>번호</th>
          <th>제목</th>
          <th>작성시간</th>
        </tr>
      </thead>
      <tbody>
        {announcements.map((item) => (
          <tr key={item.id} onClick={() => handleRowClick(item.id)}>
            <td>{item.id}</td>
            <td>{item.title}</td>
            <td>{formatDateTime(item.created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AnnounceList;