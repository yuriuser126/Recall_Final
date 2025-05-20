// App.js (일부 수정)
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import AnnouncePage from './pages/AnnouncePage'; // AnnouncePage import
import AnnounceViewPage from './pages/AnnounceViewPage'; // AnnounceViewPage import
import FaqPage from './pages/FaqPage'; // FaqPage import
import FaqWritePage from './pages/FaqWritePage';
import { fetchTestData } from './services/api';
import './styles/App.css';

function App() {
const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    const loadTestData = async () => {
      const data = await fetchTestData();
      setBackendData(data);
    };

    loadTestData();
  }, []);


  return (
    <Router>
      <MainLayout>
        {/* 네비게이션은 Header 컴포넌트 내부에서 처리되므로 여기서는 삭제하거나 변경 */}
        {/* 기존 App.js의 <nav> 부분은 Header.js로 옮겨졌습니다. */}
        {/* 만약 App.js에서 라우팅을 테스트할 메뉴가 필요하면 여기에 추가 가능 */}
        {/* 예를 들어, AnnouncePage로 가는 링크 추가: */}
        <nav>
          <ul>
            <li><Link to="/">홈</Link></li>
            <li><Link to="/profile">프로필</Link></li>
            <li><Link to="/announce">공지사항</Link></li> {/* 공지사항 링크 추가 */}
          </ul>
        </nav>



        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/announce" element={<AnnouncePage />} /> 
          <Route path="/announce_view/:id" element={<AnnounceViewPage />} /> 
          <Route path="/notice" element={<FaqPage />} /> 
          <Route path="/notice_write" element={<FaqWritePage />} />
        </Routes>


        {backendData && (
          <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
            <h3>백엔드 데이터:</h3>
            <p>{backendData}</p>
          </div>
        )}
      </MainLayout>
    </Router>
  );
}

export default App;
