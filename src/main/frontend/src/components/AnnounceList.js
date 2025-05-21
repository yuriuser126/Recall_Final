// components/AnnounceList.js
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '../utils/formatters';

const AnnounceList = ({ announcements = [], total = 0 }) => {
  const navigate = useNavigate();

  if (!announcements.length) {
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
        {announcements.map(({ id, title, created_at }) => (
          <tr key={id} onClick={() => navigate(`/announce_view/${id}?total=${total}`)}>
            <td>{id}</td>
            <td>{title}</td>
            <td>{formatDateTime(created_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AnnounceList;