// pages/FaqWritePage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // API 호출을 위해 axios 사용

function FaqWritePage() {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [formData, setFormData] = useState({
    // 백엔드 FaqsDTO의 필드명과 일치시켜야 합니다.
    // 기존 JSP에서 작성자 ID와 currentTime은 input name이 없었으므로,
    // 백엔드에서 해당 정보가 필요하다면 별도로 처리해야 합니다.
    // 여기서는 질문(question)과 답변(answer)만 상태로 관리합니다.
    question: '',
    answer: '',
    // 기타 필요한 필드 (예: authorId, createdAt 등)는 백엔드에서 처리하거나,
    // 필요하다면 여기에서 상태로 관리하고 폼에 추가해야 합니다.
    // 현재 시간은 보통 백엔드에서 자동으로 생성합니다.
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // 입력 필드 변경 시 상태 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지 (페이지 새로고침 방지)

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // 백엔드 API 호출
      // 백엔드 컨트롤러에 @RequestMapping("/api/notices") @PostMapping("/write")로 설정했음
      const API_URL = 'http://localhost:8485/api/faqs/write'; // Spring Boot API 경로 확인

      const response = await axios.post(API_URL, formData); // formData를 JSON 형태로 전송

      setSuccessMessage(response.data || 'FAQ가 성공적으로 작성되었습니다.');
      console.log('FAQ 작성 성공:', response.data);

      // 성공 후 FAQ 목록 페이지로 이동 (선택 사항)
      // 실제 애플리케이션에서는 성공 메시지를 보여준 후 목록으로 이동하는 것이 일반적
      setTimeout(() => {
        navigate('/notice'); // '/notice'는 FAQ 목록 페이지 라우트
      }, 1500); // 1.5초 후 이동
      
    } catch (err) {
      setError(err.response?.data || 'FAQ 작성 중 오류가 발생했습니다.');
      console.error('FAQ 작성 실패:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main">
      {/* Page Title */}
      <div className="page-title">
        <div className="heading">
          <div className="container">
            <div className="row d-flex justify-content-center text-center">
              <div className="col-lg-8">
                <h1>FAQ 작성</h1>
                <p className="mb-0">새로운 자주 묻는 질문을 작성합니다.</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="breadcrumbs">
          <div className="container">
            <ol>
              <li><Link to="/">차량리콜도우미</Link></li>
              <li><Link to="/notice">FAQ</Link></li>
              <li className="current">FAQ 작성</li>
            </ol>
          </div>
        </nav>
      </div>{/* End Page Title */}

      <section id="faq-write-section" className="faq-write-section section" style={{ padding: '40px 0' }}>
        <div className="container" data-aos="fade-up">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <form onSubmit={handleSubmit} className="faqann-form">
                <div className="row gy-4">

                  {/* 작성자 ID (React에서는 사용자 인증 정보에서 가져오는 것이 일반적) */}
                  {/* 여기서는 임시로 readonly로 표시하거나, 로그인 정보에서 가져오도록 변경 */}
                  <div className="col-md-6">
                    <input type="text" name="authorId" className="form-control" placeholder="작성자ID (예: testuser)" value="관리자" readOnly />
                    {/* 실제 앱에서는 로그인한 사용자 ID를 여기에 설정 */}
                  </div>

                  {/* 현재 시간 (백엔드에서 자동 생성하는 것이 일반적) */}
                  <div className="col-md-6">
                    <input type="text" className="form-control" value={new Date().toLocaleString()} readOnly />
                  </div>

                  <div className="col-md-12">
                    <input
                      type="text"
                      name="question"
                      className="form-control"
                      placeholder="질문"
                      value={formData.question}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-12">
                    <textarea
                      className="form-control"
                      name="answer"
                      rows="8"
                      placeholder="내용"
                      value={formData.answer}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="col-md-12 text-center">
                    {loading && <div className="loading">작성 중...</div>}
                    {error && <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                    {successMessage && <div className="sent-message" style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}

                    <button type="submit" disabled={loading} style={{
                      padding: '10px 20px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      marginTop: '20px'
                    }}>
                      {loading ? '작성 중...' : '작성하기'}
                    </button>
                    <Link to="/notice" style={{
                        marginLeft: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        textDecoration: 'none',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        cursor: 'pointer'
                    }}>목록으로</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default FaqWritePage;