// src/pages/DefectReportList.js
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';

import DefectListSearch from '../components/DefectListSearch';
import Pagination from '../components/Pagination';

import { fetchDefectReports } from '../services/defectApiService';

function DefectReportList() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const getInitialSearchCriteria = useCallback(() => {
        const initial = {
            type: searchParams.get('type') || '',
            keyword: searchParams.get('keyword') || '',
            // URL에서 'yyyy-MM-dd' 문자열로 받아 Date 객체로 변환. 유효하지 않으면 빈 문자열.
            reportDate: searchParams.get('reportDate') ? new Date(searchParams.get('reportDate')) : '',
            pageNum: parseInt(searchParams.get('pageNum') || '1', 10),
            amount: parseInt(searchParams.get('amount') || '10', 10),
        };
        // Date 객체 생성 후 유효성 검사 (NaN 체크)
        if (initial.reportDate instanceof Date && isNaN(initial.reportDate.getTime())) {
            initial.reportDate = ''; // 유효하지 않은 날짜면 빈 문자열
        }
        return initial;
    }, [searchParams]);

    const [searchCriteria, setSearchCriteria] = useState(getInitialSearchCriteria);
    const [defectList, setDefectList] = useState([]);
    const [pageMaker, setPageMaker] = useState({
        startPage: 1,
        endPage: 1,
        prev: false,
        next: false,
        total: 0,
        cri: { pageNum: 1, amount: 10, type: '', keyword: '', reportDate: '' },
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadDefectReports = useCallback(async (currentCriteria) => {
        setLoading(true);
        setError(null);
        try {
            const criteriaToSend = {
                ...currentCriteria,
                // reportDate가 Date 객체인 경우에만 'yyyy-MM-dd' 문자열로 포맷팅.
                // 아니면 그대로 빈 문자열을 유지하여 전송하지 않도록 함.
                reportDate: currentCriteria.reportDate instanceof Date && !isNaN(currentCriteria.reportDate.getTime())
                            ? format(currentCriteria.reportDate, 'yyyy-MM-dd')
                            : '',
            };

            const data = await fetchDefectReports(criteriaToSend);

            setDefectList(data.list || []);
            setPageMaker(data.pageMaker || {
                startPage: 1, endPage: 1, prev: false, next: false, total: 0, cri: criteriaToSend
            });

            // URL 쿼리 파라미터 업데이트
            // criteriaToSend에서 reportDate가 빈 문자열이면 URL에 포함되지 않도록 함
            const cleanParams = {};
            for (const key in criteriaToSend) {
                if (criteriaToSend[key] !== '') { // 빈 문자열 파라미터는 URL에서 제외
                    cleanParams[key] = criteriaToSend[key];
                }
            }
            setSearchParams(new URLSearchParams(cleanParams).toString());

        } catch (err) {
            console.error("데이터를 가져오는 데 실패했습니다:", err);
            setError("데이터를 가져오는 데 실패했습니다. 서버 상태를 확인해주세요.");
            setDefectList([]);
            setPageMaker({ startPage: 1, endPage: 1, prev: false, next: false, total: 0, cri: currentCriteria });
        } finally {
            setLoading(false);
        }
    }, [setSearchParams]);

    useEffect(() => {
        const initialCri = getInitialSearchCriteria();
        setSearchCriteria(initialCri);
        loadDefectReports(initialCri);
    }, [getInitialSearchCriteria, loadDefectReports]);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria(prev => ({
            ...prev,
            [name]: name === 'reportDate' && value ? new Date(value) : value,
        }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const updatedCri = { ...searchCriteria, pageNum: 1 };
        setSearchCriteria(updatedCri);
        loadDefectReports(updatedCri);
    };

    const handlePageChange = useCallback((newCri) => {
        setSearchCriteria(newCri);
        loadDefectReports(newCri);
    }, [loadDefectReports]);

    const handleRowClick = (id) => {
        navigate(`/defect_detail/${id}`);
    };

    if (loading) return <div>공지사항을 불러오는 중입니다...</div>;
    if (error) return <div>오류: {error}</div>;

    return (
        <main id="main">
            {/* ... (이전과 동일한 HTML 구조) ... */}
            <div className="page-title">
                {/* ... */}
            </div>

            <section id="starter-section" className="starter-section section" style={{ padding: '40px 0' }}>
                <div className="container" data-aos="fade-up">
                    <div className="section-title text-center">
                        <h2 className="title">신고 내역</h2>
                    </div>

                    <div className="widgets-container">
                        <DefectListSearch
                            searchCriteria={{
                                ...searchCriteria,
                                // DefectListSearch에는 날짜를 'yyyy-MM-dd' 문자열로 전달
                                reportDate: searchCriteria.reportDate instanceof Date && !isNaN(searchCriteria.reportDate.getTime())
                                            ? format(searchCriteria.reportDate, 'yyyy-MM-dd')
                                            : '',
                            }}
                            onSearchChange={handleSearchChange}
                            onSearchSubmit={handleSearchSubmit}
                        />

                        <table className="table-custom uk-table uk-table-striped uk-table-hover" style={{ width: '80%', margin: '0 auto' }}>
                            <thead>
                                <tr>
                                    <td>번호</td>
                                    <td>신고자</td>
                                    <td>신고유형</td>
                                    <td>모델명</td>
                                    <td>신고일</td>
                                </tr>
                            </thead>
                            <tbody>
                                {defectList.length > 0 ? (
                                    defectList.map(dto => (
                                        <tr key={dto.id} onClick={() => handleRowClick(dto.id)} style={{ cursor: 'pointer' }}>
                                            <td>{dto.id}</td>
                                            <td>{dto.reporter_name}</td>
                                            <td>{dto.report_type === 'A' ? '자동차' : dto.report_type === 'B' ? '이륜차' : dto.report_type}</td>
                                            <td>{dto.car_model}</td>
                                            <td>{dto.report_date ? format(new Date(dto.report_date), 'yyyy-MM-dd') : ''}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center' }}>신고 내역이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination pageMaker={pageMaker} onPageChange={handlePageChange} />

                </div>
            </section>
        </main>
    );
}

export default DefectReportList;