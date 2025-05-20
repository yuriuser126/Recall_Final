// pages/AnnouncePage.js
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // URL 쿼리 파라미터 읽기
import AnnounceList from '../components/AnnounceList';
import AnnounceSearch from '../components/AnnounceSearch';
import Pagination from '../components/Pagination';
import { fetchAnnouncements } from '../services/announceService';


function AnnouncePage() {
  const [announcements, setAnnouncements] = useState([]);
  const [pageMaker, setPageMaker] = useState({
    cri: { pageNum: 1, amount: 10, type: '', keyword: '' },
    total: 0,
    startPage: 1,
    endPage: 1,
    prev: false,
    next: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // URL 쿼리 파라미터에서 초기 검색 조건 가져오기
  useEffect(() => {
    const initialPageNum = parseInt(searchParams.get('pageNum')) || 1;
    const initialAmount = parseInt(searchParams.get('amount')) || 10;
    const initialType = searchParams.get('type') || '';
    const initialKeyword = searchParams.get('keyword') || '';

    setPageMaker(prev => ({
      ...prev,
      cri: {
        pageNum: initialPageNum,
        amount: initialAmount,
        type: initialType,
        keyword: initialKeyword,
      },
    }));
  }, [searchParams]);

  const loadAnnouncements = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
        const data = await fetchAnnouncements(params);
        setAnnouncements(data.list);
        setPageMaker(data.pageMaker);

        // URL 쿼리 파라미터 업데이트는 여기서 한 번만
        setSearchParams(new URLSearchParams(params).toString());

    } catch (err) {
        setError('공지사항을 불러오는 데 실패했습니다.');
        console.error(err);
    } finally {
        setLoading(false);
    }
}, [setSearchParams]); // loadAnnouncements의 의존성에는 setSearchParams만!

// 컴포넌트 마운트 시 최초 1회만 데이터 로드
useEffect(() => {
    const initialPageNum = parseInt(searchParams.get('pageNum')) || 1;
    const initialAmount = parseInt(searchParams.get('amount')) || 10;
    const initialType = searchParams.get('type') || '';
    const initialKeyword = searchParams.get('keyword') || '';

    // 최초 로드 시에만 fetchAnnouncements 호출
    loadAnnouncements({
        pageNum: initialPageNum,
        amount: initialAmount,
        type: initialType,
        keyword: initialKeyword,
    });
}, []); // 빈 배열: 컴포넌트가 처음 마운트될 때만 실행

// 페이지 변경 및 검색 로직
const handlePageChange = useCallback((newCri) => {
    setPageMaker(prev => ({ ...prev, cri: newCri })); // 상태 업데이트
    loadAnnouncements(newCri); // 데이터 다시 로드
}, [loadAnnouncements]);

const handleSearch = useCallback((searchParams) => {
    // 검색 시 항상 pageNum을 1로 초기화
    const updatedCri = { ...pageMaker.cri, ...searchParams, pageNum: 1 };
    setPageMaker(prev => ({ ...prev, cri: updatedCri })); // 상태 업데이트
    loadAnnouncements(updatedCri); // 데이터 다시 로드
}, [pageMaker.cri, loadAnnouncements]); // pageMaker.cri는 최신 값을 사용해야 하므로 의존성에 포함


  if (loading) return <div>공지사항을 불러오는 중입니다...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <div className="announce-page">
      <h2>공지사항</h2>
      <AnnounceList announcements={announcements} total={pageMaker.total} />
      
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <Link to="/announce_write" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', textDecoration: 'none' }}>글쓰기</Link>
      </div>

      <AnnounceSearch
        onSearch={handleSearch}
        initialType={pageMaker.cri.type}
        initialKeyword={pageMaker.cri.keyword}
      />
      <Pagination pageMaker={pageMaker} onPageChange={handlePageChange} />
    </div>
  );
}

export default AnnouncePage;