// src/pages/DefectModify.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';

// API 서비스를 임포트합니다.
import { fetchDefectDetail, updateDefectReport, deleteDefectReport } from '../services/defectApiService';

function DefectModify() {
    const { id } = useParams(); // URL에서 'id' 파라미터를 가져옵니다.
    const navigate = useNavigate();

    // 수정할 결함 정보를 저장할 상태
    const [defect, setDefect] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 컴포넌트 마운트 시 또는 ID 변경 시 상세 정보 불러오기
    useEffect(() => {
        const loadDefectDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchDefectDetail(id); // ID에 해당하는 상세 정보 API 호출
                setDefect({
                    ...data,
                    // 날짜 필드를 Date 객체로 변환 (input type="date" 사용 시 필요할 수 있음)
                    // 현재는 텍스트 입력이므로 문자열 유지해도 무방하나, 일관성을 위해 Date 객체로 관리
                    report_date: data.report_date ? new Date(data.report_date) : null,
                    car_manufacturing_date: data.car_manufacturing_date ? new Date(data.car_manufacturing_date) : null,
                });
            } catch (err) {
                console.error("결함 상세 정보를 불러오는 데 실패했습니다:", err);
                setError("결함 상세 정보를 불러오는 데 실패했습니다. ID를 확인해주세요.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadDefectDetail();
        }
    }, [id]);

    // 입력 필드 값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDefect(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // '수정' 버튼 클릭 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 기본 제출 동작 방지

        if (!defect) return;

        try {
            // 서버로 보낼 데이터를 준비 (날짜는 'yyyy-MM-dd' 형식의 문자열로 변환)
            const defectDataToSend = {
                ...defect,
                report_date: defect.report_date ? format(new Date(defect.report_date), 'yyyy-MM-dd') : null,
                car_manufacturing_date: defect.car_manufacturing_date ? format(new Date(defect.car_manufacturing_date), 'yyyy-MM-dd') : null,
            };

            await updateDefectReport(defectDataToSend); // 수정 API 호출
            alert('신고 내역이 성공적으로 수정되었습니다.');
            navigate(`/defect_detail/${id}`); // 수정 후 상세 페이지로 이동
        } catch (err) {
            console.error("신고 내역 수정 중 오류 발생:", err);
            alert('신고 내역 수정에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // '삭제' 버튼 클릭 핸들러
    const handleDelete = async () => {
        if (window.confirm('정말로 이 신고 내역을 삭제하시겠습니까?')) {
            try {
                await deleteDefectReport(id); // 삭제 API 호출
                alert('신고 내역이 성공적으로 삭제되었습니다.');
                navigate('/defect_list'); // 삭제 후 목록 페이지로 이동
            } catch (err) {
                console.error("신고 내역 삭제 중 오류 발생:", err);
                alert('신고 내역 삭제에 실패했습니다. 다시 시도해주세요.');
            }
        }
    };

    // '목록보기' 버튼 클릭 핸들러
    const handleToList = () => {
        navigate('/defect_list');
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>정보를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>오류: {error}</div>;
    }

    if (!defect) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>해당 신고 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <main id="main">
            {/* Page Title */}
            <div className="page-title">
                <div className="heading">
                    <div className="container">
                        <div className="row d-flex justify-content-center text-center">
                            <div className="col-lg-8">
                                <h1>신고 내역 수정</h1>
                                <p className="mb-0">신고된 차량 결함 내역을 수정합니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="breadcrumbs">
                    <div className="container">
                        <ol>
                            <li><Link to="/">홈</Link></li>
                            <li><Link to="/defect_list">신고 내역</Link></li>
                            <li><Link to={`/defect_detail/${id}`}>상세 보기</Link></li>
                            <li className="current">수정</li>
                        </ol>
                    </div>
                </nav>
            </div>

            {/* Starter Section Section */}
            <section id="starter-section" className="starter-section section" style={{ padding: '40px 0' }}>
                <div className="container" data-aos="fade-up">
                    <div className="section-title text-center">
                        <h2 className="title">신고 내역 수정</h2>
                    </div>

                    <div className="widgets-container">
                        {/* React에서는 폼의 상태를 직접 관리하고 제출은 비동기 API 호출로 처리 */}
                        <form onSubmit={handleSubmit}>
                            <input type="hidden" name="id" value={defect.id} /> {/* ID는 숨김 필드로 유지 */}

                            <table className="table-custom" width="500" border="1" style={{ margin: '0 auto' }}>
                                <tbody>
                                    <tr>
                                        <td>번호</td>
                                        <td>{defect.id}</td>
                                        <td>신고자</td>
                                        <td>{defect.reporter_name}</td>
                                        <td>신고일</td>
                                        <td>{defect.report_date ? format(defect.report_date, 'yyyy-MM-dd') : '날짜 없음'}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4"></td>
                                        <td>차량 제조일자</td>
                                        <td>
                                            {defect.car_manufacturing_date ? format(defect.car_manufacturing_date, 'yyyy-MM-dd') : '날짜 없음'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <br />
                            <hr />
                            <br />
                            <table className="table-custom" border="1" style={{ margin: '0 auto' }}>
                                <tbody>
                                    {/* hidden input은 <form> 태그 안에만 있어도 되므로, 중복될 필요는 없습니다. */}
                                    <tr>
                                        <td width="100" height="80">신고유형</td>
                                        <td>
                                            <input
                                                type="text"
                                                name="report_type"
                                                className="form-control"
                                                value={defect.report_type || ''}
                                                onChange={handleChange}
                                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="100" height="80">모델명</td>
                                        <td>
                                            <input
                                                type="text"
                                                name="car_model"
                                                className="form-control"
                                                value={defect.car_model || ''}
                                                onChange={handleChange}
                                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="100" height="80">제조사</td>
                                        <td>
                                            <input
                                                type="text"
                                                name="car_manufacturer"
                                                className="form-control"
                                                value={defect.car_manufacturer || ''}
                                                onChange={handleChange}
                                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="buttons" style={{ textAlign: 'center', marginTop: '20px' }}>
                                <div className="buttonCenter" style={{ display: 'inline-block' }}>
                                    <button
                                        type="submit" // 폼 제출 버튼
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#28a745', // 수정 버튼 색상
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            marginRight: '10px'
                                        }}
                                    >
                                        수정
                                    </button>
                                    <button
                                        type="button" // 폼 제출 아님
                                        onClick={handleDelete}
                                        style={{
                                            padding: '10px 20px',
                                            backgroundColor: '#dc3545', // 삭제 버튼 색상
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        삭제
                                    </button>
                                </div>
                                <button
                                    type="button" // 폼 제출 아님
                                    className="rightButton"
                                    onClick={handleToList}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#6c757d', // 목록보기 버튼 색상
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        marginLeft: '20px' // 오른쪽 버튼처럼 보이도록 마진 추가
                                    }}
                                >
                                    목록보기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default DefectModify;