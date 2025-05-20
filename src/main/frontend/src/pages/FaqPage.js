// pages/FaqPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import FaqItem from '../components/FaqItem'; // FaqItem 컴포넌트 import
import AnnounceSearch from '../components/AnnounceSearch'; // AnnouncePage에서 재사용
import Pagination from '../components/Pagination'; // AnnouncePage에서 재사용
import { fetchFaqs } from '../services/faqService'; // FAQ 서비스 import
import '../assets/Global.css'; // 전체 스타일 적용

function FaqPage() {
  const [faqs, setFaqs] = useState([]);
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

  useEffect(() => {
    const initialPageNum = parseInt(searchParams.get('pageNum')) || 1;
    const initialAmount = parseInt(searchParams.get('amount')) || 10;
    const initialType = searchParams.get('type') || '';
    const initialKeyword = searchParams.get('keyword') || '';

    // 초기 cri 객체를 생성하여 loadFaqs를 호출합니다.
    // pageMaker.cri 상태를 직접 업데이트하는 대신, 이 초기 cri를 기반으로 데이터를 로드합니다.
    loadFaqs({
      pageNum: initialPageNum,
      amount: initialAmount,
      type: initialType,
      keyword: initialKeyword,
    });
  }, []); // 빈 배열: 컴포넌트가 처음 마운트될 때만 실행

  // 데이터를 로드하는 함수. useCallback으로 감싸서 불필요한 재생성을 막습니다.
  const loadFaqs = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFaqs(params);
      setFaqs(data.list);
      setPageMaker(data.pageMaker);

      // URL 쿼리 파라미터 업데이트는 여기서 한 번만!
      setSearchParams(new URLSearchParams(params).toString());

    } catch (err) {
      setError('FAQ를 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [setSearchParams]); // loadFaqs의 의존성에는 setSearchParams만!

  // 페이지 변경 핸들러: 새로운 cri 값을 받아서 데이터를 다시 로드합니다.
  const handlePageChange = useCallback((newCri) => {
    // pageMaker.cri 상태를 먼저 업데이트하고, 그 값을 이용해 데이터를 로드합니다.
    setPageMaker(prev => ({ ...prev, cri: newCri }));
    loadFaqs(newCri);
  }, [loadFaqs]);

  // 검색 핸들러: 새로운 검색 조건을 받아서 데이터를 다시 로드합니다.
  const handleSearch = useCallback((searchParams) => {
    // 검색 시 항상 pageNum을 1로 초기화합니다.
    const updatedCri = { ...pageMaker.cri, ...searchParams, pageNum: 1 };
    setPageMaker(prev => ({ ...prev, cri: updatedCri })); // 상태 업데이트
    loadFaqs(updatedCri); // 데이터 다시 로드
  }, [pageMaker.cri, loadFaqs]); // pageMaker.cri는 최신 값을 사용해야 하므로 의존성에 포함


  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>FAQ를 불러오는 중입니다...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>오류: {error}</div>;

  return (
    <main id="main">
      {/* Page Title */}
      <div className="page-title">
        <div className="heading">
          <div className="container">
            <div className="row d-flex justify-content-center text-center">
              <div className="col-lg-8">
                <h1>FAQ</h1>
                <p className="mb-0">자동차제작결함 및 신차안전도평가와 관련하여 FAQ를 제공합니다.</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="breadcrumbs">
          <div className="container">
            <ol>
              <li><Link to="/">차량리콜도우미</Link></li>
              <li className="current">FAQ</li>
            </ol>
          </div>
        </nav>
      </div>{/* End Page Title */}

      {/* Starter Section Section */}
      <section id="starter-section" className="starter-section section">
        <div className="container section-title" data-aos="fade-up" style={{ listStyleType: 'none' }}>
          {/* Faq Section */}
          <section id="faq" className="faq section">
            <div className="container">
              <div className="row gy-4">
                <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
                  <div className="content px-xl-5">
                    <h3><span>자주 묻는 </span><strong>질문들</strong></h3>
                  </div>
                </div>

                <div className="col-lg-8" data-aos="fade-up" data-aos-delay="200">
                  <div className="faq-container">
                    {faqs.length > 0 ? (
                      faqs.map((item) => (
                        <FaqItem key={item.id} item={item} /> // FaqItem 컴포넌트 사용
                      ))
                    ) : (
                      <p style={{ textAlign: 'center' }}>표시할 FAQ가 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>{/* /Faq Section */}

          {/* Blog Pagination Section (AnnouncePage에서 재사용) */}
          <section id="blog-pagination" className="blog-pagination section">
            <AnnounceSearch
              onSearch={handleSearch}
              initialType={pageMaker.cri.type}
              initialKeyword={pageMaker.cri.keyword}
            />
            <Pagination pageMaker={pageMaker} onPageChange={handlePageChange} />
          </section>{/* /Blog Pagination Section */}

          <div style={{ textAlign: 'right', marginTop: '20px' }}>
             <Link to="/notice_write" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', textDecoration: 'none' }}>글작성</Link>
          </div>
        </div>
      </section>{/* /Starter Section Section */}
    </main>
  );
}

export default FaqPage;