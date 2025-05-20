// src/pages/RecallList.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { format } from 'date-fns'; // 필요시 사용 (리콜 데이터에 날짜 필드가 있다면)

import Pagination from '../components/Pagination'; // 기존에 구현된 Pagination 컴포넌트 재활용

// 리콜 API 서비스를 임포트합니다.
import { fetchRecallReports, downloadRecallCsv, downloadRecallExcel } from '../services/recallApiService';

function RecallList() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams(); // URL 쿼리 파라미터 관리

    // 초기 검색/페이징 조건 설정 (URL 파라미터에서 읽어옴)
    const getInitialSearchCriteria = useCallback(() => {
        return {
            type: searchParams.get('type') || '',      // 검색 타입 (예: 모델명, 제조사)
            keyword: searchParams.get('keyword') || '',// 검색 키워드
            pageNum: parseInt(searchParams.get('pageNum') || '1', 10), // 페이지 번호
            amount: parseInt(searchParams.get('amount') || '10', 10),   // 한 페이지당 항목 수
        };
    }, [searchParams]);

    const [searchCriteria, setSearchCriteria] = useState(getInitialSearchCriteria);
    const [recallList, setRecallList] = useState([]); // 리콜 목록 데이터를 저장할 상태
    const [pageMaker, setPageMaker] = useState({    // 페이징 정보를 저장할 상태
        startPage: 1,
        endPage: 1,
        prev: false,
        next: false,
        total: 0,
        cri: { pageNum: 1, amount: 10, type: '', keyword: '' }, // 현재 Cri 객체
    });
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null);   // 에러 상태

    // 데이터를 실제로 로드하는 함수
    const loadRecallReports = useCallback(async (currentCriteria) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchRecallReports(currentCriteria); // API 서비스 호출

            setRecallList(data.list || []); // <--- 서버 응답에서 'list' 키를 기대합니다.
            setPageMaker(data.pageMaker || { // <--- 서버 응답에서 'pageMaker' 키를 기대합니다.
                startPage: 1, endPage: 1, prev: false, next: false, total: 0, cri: currentCriteria
            });

            // URL 쿼리 파라미터 업데이트
            const cleanParams = {};
            for (const key in currentCriteria) {
                if (currentCriteria[key] !== '' && currentCriteria[key] !== null && currentCriteria[key] !== undefined) {
                    cleanParams[key] = currentCriteria[key];
                }
            }
            setSearchParams(new URLSearchParams(cleanParams).toString());

        } catch (err) {
            console.error("리콜 데이터를 가져오는 데 실패했습니다:", err);
            setError("리콜 데이터를 가져오는 데 실패했습니다. 서버 상태를 확인해주세요.");
            setRecallList([]);
            setPageMaker({ startPage: 1, endPage: 1, prev: false, next: false, total: 0, cri: currentCriteria });
        } finally {
            setLoading(false);
        }
    }, [setSearchParams]);

    // 컴포넌트 마운트 시 또는 URL 파라미터 변경 시 데이터 로드
    useEffect(() => {
        const initialCri = getInitialSearchCriteria();
        setSearchCriteria(initialCri); // 초기 상태 업데이트
        loadRecallReports(initialCri); // 초기 데이터 로드
    }, [getInitialSearchCriteria, loadRecallReports]);

    // 페이지 변경 핸들러 (Pagination 컴포넌트에서 호출)
    const handlePageChange = useCallback((newCri) => {
        setSearchCriteria(newCri); // 새로운 Cri 객체로 상태 업데이트
        loadRecallReports(newCri); // 업데이트된 Cri로 API 호출
    }, [loadRecallReports]);

    // 리콜 상세 페이지로 이동
    const handleRowClick = (id) => {
        navigate(`/recall_detail/${id}`); // 상세 페이지 경로 예시
    };

    // CSV 다운로드 버튼 핸들러
    const handleDownloadCsv = async () => {
        try {
            await downloadRecallCsv(); // CSV 다운로드 API 호출
            alert("CSV 파일 다운로드를 시작합니다.");
        } catch (err) {
            console.error("CSV 다운로드 실패:", err);
            alert("CSV 파일 다운로드에 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 엑셀 다운로드 버튼 핸들러
    const handleDownloadExcel = async () => {
        try {
            await downloadRecallExcel(); // 엑셀 다운로드 API 호출
            alert("엑셀 파일 다운로드를 시작합니다.");
        } catch (err) {
            console.error("엑셀 다운로드 실패:", err);
            alert("엑셀 파일 다운로드에 실패했습니다. 다시 시도해주세요.");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>리콜 정보를 불러오는 중입니다...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>오류: {error}</div>;

    return (
        <main id="main">
            {/* Page Title */}
            <div className="page-title">
                <div className="heading">
                    <div className="container">
                        <div className="row d-flex justify-content-center text-center">
                            <div className="col-lg-8">
                                <h1>리콜내역조회</h1>
                                <p className="mb-0">신고된 자동차 및 건설기계 리콜내역을 조회할 수 있습니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="breadcrumbs">
                    <div className="container">
                        <ol>
                            <li><Link to="/">홈</Link></li>
                            <li className="current">리콜내역조회</li>
                        </ol>
                    </div>
                </nav>
            </div>{/* End Page Title */}

            {/* Starter Section Section */}
            <section id="starter-section" className="starter-section section">
                <div className="container" data-aos="fade-up">
                    <div className="section-title text-center">
                        <h2 className="title">리콜 내역</h2>
                    </div>

                    <div className="widgets-container">
                        {/* 검색 컴포넌트가 있다면 여기에 추가 (DefectListSearch와 유사하게) */}
                        {/* <RecallListSearch searchCriteria={searchCriteria} onSearchChange={handleSearchChange} onSearchSubmit={handleSearchSubmit} /> */}

                        <table className="table-custom" style={{ width: '100%', margin: '0 auto', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th>리콜 ID</th>
                                    <th>제품명</th>
                                    <th>제조사</th>
                                    <th>제조기간</th>
                                    <th>기타정보</th>
                                    <th>모델명</th>
                                    <th>리콜유형</th>
                                    <th>연락처</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recallList.length > 0 ? (
                                    recallList.map(item => (
                                        <tr key={item.id} onClick={() => handleRowClick(item.id)} style={{ cursor: 'pointer' }}>
                                            <td>{item.id}</td>
                                            <td>{item.product_name}</td>
                                            <td>{item.manufacturer}</td>
                                            <td>{item.manufacturing_period}</td> {/* 날짜라면 format 필요 */}
                                            <td>{item.additional_info}</td>
                                            <td>{item.model_name}</td>
                                            <td>{item.recall_type}</td>
                                            <td>{item.contact_info}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>리콜 내역이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button
                            id="downloadCsvBtn"
                            onClick={handleDownloadCsv}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                        >
                            CSV 전체 다운로드
                        </button>
                        <button
                            id="excelDownloadBtn"
                            onClick={handleDownloadExcel}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            엑셀 전체 다운로드
                        </button>
                    </div>

                    {/* Pagination 컴포넌트 재사용 */}
                    <Pagination pageMaker={pageMaker} onPageChange={handlePageChange} />

                </div>
            </section>
        </main>
    );
}

export default RecallList;