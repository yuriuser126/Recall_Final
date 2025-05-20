// src/pages/DefectPasswordCheck.js
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// API 서비스를 임포트합니다.
import { checkPassword } from '../services/defectApiService'; // 이전에 추가했던 함수

function DefectPasswordCheck() {
    const { id } = useParams(); // URL에서 'id' 파라미터를 가져옵니다. 예: /defect_pwcheck/123
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    const [password, setPassword] = useState(''); // 입력된 비밀번호를 저장할 상태
    const [message, setMessage] = useState('');   // 사용자에게 보여줄 메시지 (성공/실패 등)

    // 비밀번호 입력 필드 변경 핸들러
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setMessage(''); // 비밀번호를 다시 입력하면 메시지 초기화
    };

    // '확인' 버튼 클릭 시 비밀번호 검증 로직
    const handlePasswordCheck = async () => {
        if (!password) {
            setMessage('비밀번호를 입력해주세요.');
            return;
        }

        try {
            // 서버의 비밀번호 확인 API 호출
            const result = await checkPassword(id, password);

            if (result === true) { // 서버에서 true를 반환하는 경우
                setMessage('비밀번호가 확인되었습니다. 수정 페이지로 이동합니다.');
                // 비밀번호 확인 성공 시 수정 페이지로 이동 (예: /defect_modify/ID)
                navigate(`/defect_modify/${id}`);
            } else {
                setMessage('비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            console.error("비밀번호 확인 중 오류 발생:", error);
            setMessage('비밀번호 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    // '돌아가기' 버튼 클릭 시
    const handleGoBack = () => {
        navigate('/defect_list'); // 신고 내역 목록 페이지로 이동
    };

    return (
        <main id="main">
            {/* Page Title */}
            <div className="page-title">
                <div className="heading">
                    <div className="container">
                        <div className="row d-flex justify-content-center text-center">
                            <div className="col-lg-8">
                                <h1>신고내역조회</h1>
                                <p className="mb-0">신고된 자동차 및 건설기계 결함내역을 조회할 수 있습니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="breadcrumbs">
                    <div className="container">
                        <ol>
                            <li><Link to="/">홈</Link></li>
                            <li className="current">신고내역조회</li>
                        </ol>
                    </div>
                </nav>
            </div>{/* End Page Title */}

            {/* Starter Section Section */}
            <section id="starter-section" className="starter-section section">
                {/* Section Title */}
                <div className="container section-title" data-aos="fade-up">
                    <h2 className="title">비밀번호 확인</h2>

                    <div className="widgets-container">
                        <div>
                            <div>
                                <p>결함신고시 등록한 비밀번호를 입력하세요.</p>
                                <br />
                                <div className="pwdButton">
                                    <input
                                        type="password"
                                        id="popPw"
                                        placeholder="비밀번호"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        onKeyPress={(e) => { // 엔터 키 입력 시 확인 버튼 클릭 효과
                                            if (e.key === 'Enter') {
                                                handlePasswordCheck();
                                            }
                                        }}
                                        style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handlePasswordCheck}
                                        style={{
                                            padding: '8px 15px',
                                            backgroundColor: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        확인
                                    </button>
                                </div>
                                {message && <p style={{ color: message.includes('오류') || message.includes('일치하지') ? 'red' : 'green', marginTop: '10px' }}>{message}</p>}
                            </div>
                            <div className="pwdButtonC" style={{ textAlign: 'center', marginTop: '20px' }}>
                                <button
                                    onClick={handleGoBack}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#6c757d', // 회색 버튼
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    돌아가기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>{/* /Starter Section Section */}
        </main>
    );
}

export default DefectPasswordCheck;