// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import { fetchTestData } from './services/api';

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
        <nav>
          <ul>
            <li>
              <Link to="/">홈</Link>
            </li>
            <li>
              <Link to="/profile">프로필</Link>
            </li>
          </ul>
        </nav>



        <Modal/>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<UserProfilePage />} />
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
