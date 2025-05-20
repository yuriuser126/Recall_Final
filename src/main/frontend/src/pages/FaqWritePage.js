// src/pages/FaqWritePage.js (수정)
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import FormEditor from '../components/FormEditor'; // FormEditor import

function FaqWritePage() {
  const navigate = useNavigate();
  const initialFaqData = { question: '', answer: '' };
  // FormEditor에 전달할 필드 정의
  const fields = [
    { name: 'question', type: 'text', placeholder: '질문', required: true },
    { name: 'answer', type: 'textarea', placeholder: '내용', required: true, rows: 8 },
  ];

  // FAQ 제출 로직
  const handleFaqSubmit = async (formData) => {
    const API_URL = 'http://localhost:8485/api/faqs/write'; // FAQ 작성 API 경로

    // 백엔드 FaqsDTO 필드에 맞게 formData를 가공할 수 있음
    // 예: const payload = { ...formData, writer: '관리자' };

    await axios.post(API_URL, formData); // 데이터 전송

    // 성공 후 FAQ 목록으로 이동
    setTimeout(() => {
      navigate('/notice'); // FAQ 목록 페이지 라우트
    }, 1500);
  };

  return (
    <main id="main">
      {/* Page Title (AnnounceWritePage와 동일한 구조) */}
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
              <FormEditor
                  fields={fields}
                  onSubmit={handleFaqSubmit}
                  initialData={initialFaqData} // 처음 렌더링 시에만 사용됨
                  submitButtonText="FAQ 작성하기"
              />
               <div className="col-md-12 text-center" style={{ marginTop: '20px' }}>
                    <Link to="/notice" style={{
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
          </div>
        </div>
      </section>
    </main>
  );
}

export default FaqWritePage;