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
import AnnounceWritePage from './pages/AnnounceWritePage';
import ReportDefectPage from './pages/ReportDefectPage';
import DefectReportListPage from './pages/DefectReportList';
import DefectDetail from './pages/DefectDetail';
import DefectPasswordCheck from './pages/DefectPasswordCheck';
import DefectModify from './pages/DefectModify';
import RecallList from './pages/RecallList'
import RecallDetail from './pages/RecallDetail';
import DefectDetailsCheckPage from './pages/DefectDetailsCheckPage';
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

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/announce" element={<AnnouncePage />} /> 
          <Route path="/announce_view/:id" element={<AnnounceViewPage />} /> 
          <Route path="/notice" element={<FaqPage />} /> 
          <Route path="/notice_write" element={<FaqWritePage />} />
          <Route path="/announce_write" element={<AnnounceWritePage />} /> 
          <Route path="/defect_reports" element={<ReportDefectPage />} />
          <Route path="/defect_list" element={<DefectReportListPage />} />
          <Route path="/defect_detail/:id" element={<DefectDetail />} />
          <Route path="/defect_pwcheck/:id" element={<DefectPasswordCheck />} />
          <Route path="/defect_modify/:id" element={<DefectModify />} />
          <Route path="/recall_list" element={<RecallList />} />
          <Route path="/recall_detail/:id" element={<RecallDetail />} />
          <Route path="/defect_details_check" element={<DefectDetailsCheckPage />} />
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
