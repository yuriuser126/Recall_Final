// src/components/FormEditor.js
import { useState } from 'react';
import './FormEditor.css';

const FormEditor = ({ fields, onSubmit, initialData = {}, submitButtonText = '작성하기', showTimeField = true }) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await onSubmit(formData);
      setSuccessMessage('성공적으로 처리되었습니다!');
      // setFormData(initialData); // 필요시 폼 초기화
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError('오류 발생: ' + err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="faqann-form" data-aos="fade" data-aos-delay="100">
      <div className="row gy-4">
        {/* 관리자 ID 필드 (일반적으로 로그인 정보에서 가져옴) */}
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="관리자 ID" value="관리자" readOnly />
        </div>
        {/* 현재 시간 필드 (백엔드에서 처리하는 것이 일반적) */}
        {showTimeField && (
          <div className="col-md-6">
            <input type="text" className="form-control" value={new Date().toLocaleString()} readOnly />
          </div>
        )}
        {/* 동적으로 필드 렌더링 */}
        {fields.map((field) => (
          <div className="col-md-12" key={field.name}>
            {field.type === 'text' && (
              <input
                type="text"
                className="form-control"
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
              />
            )}
            {field.type === 'textarea' && (
              <textarea
                className="form-control"
                name={field.name}
                rows={field.rows || 8}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
              />
            )}
            {/* 다른 필드 타입 (number, select 등)은 여기에 추가 */}
          </div>
        ))}
        <div className="col-md-12 text-center">
          {loading && <div className="loading">처리 중...</div>}
          {error && <div className="error-message" style={{ color: 'red', marginTop: 10 }}>{error}</div>}
          {successMessage && <div className="sent-message" style={{ color: 'green', marginTop: 10 }}>{successMessage}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 20,
            }}
          >
            {loading ? '처리 중...' : submitButtonText}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormEditor;