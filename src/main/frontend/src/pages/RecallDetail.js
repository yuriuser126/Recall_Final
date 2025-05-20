// src/pages/RecallDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRecallDetail } from '../services/recallApiService'; // API 서비스 임포트

function RecallDetail() {
    const { id } = useParams(); // URL 파라미터에서 리콜 ID를 가져옵니다. (예: /recall_detail/123 -> id = "123")
    const [recall, setRecall] = useState(null); // 리콜 상세 정보를 저장할 상태
    const [similarIds, setSimilarIds] = useState([]); // 유사 리콜 ID를 저장할 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        const loadRecallDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                // API 서비스에서 상세 정보를 가져옵니다.
                // fetchRecallDetail 함수는 DTO와 similarIds를 포함하는 객체를 반환하도록 가정합니다.
                const data = await fetchRecallDetail(id);

                setRecall(data.recall); // 리콜 DTO (혹은 `Defect_DetailsDTO`)
                setSimilarIds(data.similarIds || []); // 유사 리콜 ID 배열

            } catch (err) {
                console.error(`리콜 상세 정보 (ID: ${id})를 가져오는 데 실패했습니다:`, err);
                setError("리콜 상세 정보를 불러오는 데 실패했습니다. 서버 상태를 확인해주세요.");
            } finally {
                setLoading(false);
            }
        };

        if (id) { // ID가 있을 때만 데이터 로드를 시도합니다.
            loadRecallDetail();
        }
    }, [id]); // id가 변경될 때마다 데이터를 다시 로드합니다.

    if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>리콜 상세 정보를 불러오는 중입니다...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>오류: {error}</div>;
    if (!recall) return <div style={{ textAlign: 'center', padding: '20px' }}>리콜 정보를 찾을 수 없습니다.</div>;

    return (
        <main id="main">
            {/* Page Title */}
            <div className="page-title">
                <div className="heading">
                    <div className="container">
                        <div className="row d-flex justify-content-center text-center">
                            <div className="col-lg-8">
                                <h1>리콜 상세 내역</h1>
                                <p className="mb-0">선택하신 리콜에 대한 상세 정보를 확인합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="breadcrumbs">
                    <div className="container">
                        <ol>
                            <li><Link to="/">홈</Link></li>
                            <li><Link to="/recall_list">리콜내역조회</Link></li>
                            <li className="current">리콜 상세</li>
                        </ol>
                    </div>
                </nav>
            </div>{/* End Page Title */}

            {/* Starter Section Section */}
            <section id="starter-section" className="starter-section section">
                <div className="container" data-aos="fade-up">
                    <div className="section-title text-center">
                        <h2 className="title">리콜 상세 정보</h2>
                    </div>

                    <div className="widgets-container">
                        <table className="table-custom" style={{ width: '100%', margin: '0 auto', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <th>리콜 번호</th>
                                    <td><b>{recall.id}</b></td>
                                </tr>
                                <tr>
                                    <th>제품명</th>
                                    <td>{recall.product_name}</td>
                                </tr>
                                <tr>
                                    <th>제조사</th>
                                    <td>{recall.manufacturer}</td>
                                </tr>
                                <tr>
                                    <th>제조기간</th>
                                    <td>{recall.manufacturing_period}</td>
                                </tr>
                                <tr>
                                    <th>기타정보</th>
                                    <td>{recall.additional_info}</td>
                                </tr>
                                <tr>
                                    <th>모델명</th>
                                    <td>{recall.model_name}</td>
                                </tr>
                                <tr>
                                    <th>리콜유형</th>
                                    <td>{recall.recall_type}</td>
                                </tr>
                                <tr>
                                    <th>연락처</th>
                                    <td>{recall.contact_info}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* 유사 리콜 추천 */}
                    <div style={{ marginTop: '30px' }}>
                        <h3 className="title">유사 리콜 추천</h3>
                        {similarIds.length > 0 ? (
                            similarIds.map(sid => (
                                <p key={sid}><Link to={`/recall_detail/${sid}`}>{sid}번 리콜 보기</Link></p>
                            ))
                        ) : (
                            <p>유사 리콜이 없습니다.</p>
                        )}
                    </div>

                    {/* 목록으로 버튼 */}
                    <div style={{ marginTop: '30px', textAlign: 'center' }}>
                        <Link to="/recall_list" className="btn-get-started" style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            textDecoration: 'none'
                        }}>
                            목록으로
                        </Link>
                    </div>

                </div>
            </section>
        </main>
    );
}

export default RecallDetail;