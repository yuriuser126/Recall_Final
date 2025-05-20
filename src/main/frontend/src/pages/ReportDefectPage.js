// src/pages/ReportDefectPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// 전화번호 포맷팅 유틸리티 함수 (formatters.js에 추가해도 좋습니다)
const formatPhoneNumber = (value) => {
  if (!value) return '';
  const cleaned = value.replace(/\D/g, ''); // 숫자만 남김
  const len = cleaned.length;

  if (len < 4) {
    return cleaned;
  } else if (len < 7) {
    return cleaned.slice(0, 3) + '-' + cleaned.slice(3);
  } else if (len < 11) {
    return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 7) + '-' + cleaned.slice(7);
  } else {
    // 010123456789 (12자리)와 같은 경우
    return cleaned.slice(0, len - 8) + '-' + cleaned.slice(len - 8, len - 4) + '-' + cleaned.slice(len - 4);
  }
};

function ReportDefectPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // 신고인 정보
    reporter_name: '',
    sex: 'F', // 기본값
    ipAddress: '1.220.191.166', // 예시 IP, 실제로는 서버에서 가져오거나 백엔드에서 자동 추가
    birth_date: '',
    mobile_number_display: '', // 화면 표시용
    mobile_number: '',       // 실제 전송용 (하이픈 없는 숫자)
    phone_number_display: '',  // 화면 표시용
    phone_number: '',        // 실제 전송용 (하이픈 없는 숫자)
    address: '', // 기본 주소
    emailAddress: '', // hidden 필드
    mailYn: 'N', // hidden 필드
    visibility: 'true', // 공개여부, 기본값 공개
    password: '',
    // 자동차 정보
    report_type: 'A', // 기본값 자동차
    car_registration_number: '',
    car_model: '',
    car_manufacturer: '',
    car_manufacturing_date: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // 현재 시간 자동 설정 (이전 FormEditor와 동일)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  useEffect(() => {
    // 실제 작성 시점의 시간은 백엔드에서 생성하는 것이 좋습니다.
    // 여기서는 단순히 display용
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'radio') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // 휴대폰 번호 입력 및 포맷팅
  const handleMobileNumberChange = (e) => {
    const displayValue = formatPhoneNumber(e.target.value);
    const rawValue = displayValue.replace(/-/g, ''); // 하이픈 제거된 숫자만 저장
    setFormData((prevData) => ({
      ...prevData,
      mobile_number_display: displayValue,
      mobile_number: rawValue,
    }));
  };

  // 전화 번호 입력 및 포맷팅
  const handleTelephoneChange = (e) => {
    const displayValue = formatPhoneNumber(e.target.value);
    const rawValue = displayValue.replace(/-/g, ''); // 하이픈 제거된 숫자만 저장
    setFormData((prevData) => ({
      ...prevData,
      phone_number_display: displayValue,
      phone_number: rawValue,
    }));
  };

  // 비밀번호 유효성 검사 (간단한 예시)
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%*()=_+.|])[a-zA-Z\d~!@#$%*()=_+.|]{9,15}$/;
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.');
      return false;
    }
    if (!regex.test(password)) {
      setPasswordError('비밀번호는 9~15자의 영문/숫자/특수문자(~, !, @, #, $, *, (, ), =, +, _, ., |) 혼용만 가능합니다.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // 비밀번호 입력 변경 시
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      password: newPassword,
    }));
    validatePassword(newPassword); // 입력 시마다 유효성 검사
  };

  // 비밀번호 보이기/숨기기 토글
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Daum Postcode API 연동 (실제 구현 필요)
  // 이 부분은 외부 라이브러리 스크립트 로드 및 콜백 함수 구현이 필요합니다.
  // 여기서는 함수 정의만 해두고, 실제 사용 시 daumPostcode API 스크립트 로드 및 동작 확인 필요.
  const daumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        // 주소 검색 완료 시 실행될 로직
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? ', ' : '') + data.buildingName;
          }
          fullAddress += (extraAddress !== '' ? ' (' + extraAddress + ')' : '');
        }

        setFormData(prevData => ({
          ...prevData,
          address: fullAddress, // 기본 주소
          // zipcode: data.zonecode, // 우편번호도 필요하면 저장
        }));
      }
    }).open();
  };
  // Daum Postcode 스크립트 로드를 위한 useEffect (보통 index.html 또는 최상위 컴포넌트에서)
  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = "//t1.daumcdn.net/map_js_init/postcode.v2.js?autoload=false";
  //   script.onload = () => {
  //     // 스크립트 로드 완료 후 실행
  //     window.daum.Postcode.load(() => {
  //       // API 준비 완료
  //     });
  //   };
  //   document.head.appendChild(script);
  //   return () => {
  //     document.head.removeChild(script);
  //   };
  // }, []);


  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 유효성 다시 검사
    if (!validatePassword(formData.password)) {
      setSubmitError('비밀번호 유효성 검사에 실패했습니다.');
      return;
    }

    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const API_URL = 'http://localhost:8485/api/defect-reports'; // 예시 API 경로, 백엔드 경로로 변경 필요
      
      // 서버로 보낼 데이터 (필요 없는 display 필드 제외)
      const dataToSend = { ...formData };
      delete dataToSend.mobile_number_display;
      delete dataToSend.phone_number_display;
      // emailAddress, mailYn 같은 hidden 필드도 필요하면 FormData에 추가
      // dataToSend.emailAddress = 'user@example.com'; // 실제 값으로 대체
      // dataToSend.mailYn = 'N'; // 실제 값으로 대체

      const response = await axios.post(API_URL, dataToSend); // JSON 형태로 전송

      setSubmitSuccess(response.data || '결함 신고가 성공적으로 접수되었습니다.');
      console.log('결함 신고 성공:', response.data);

      // 성공 후 다른 페이지로 이동 (예: 신고 완료 페이지)
      setTimeout(() => {
        navigate('/report-success'); // 임시 경로
      }, 1500);

    } catch (err) {
      setSubmitError(err.response?.data?.message || '결함 신고 중 오류가 발생했습니다.');
      console.error('결함 신고 실패:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main">
      {/* Page Title (공통 레이아웃 사용 시) */}
      <div className="page-title">
        <div className="heading">
          <div className="container">
            <div className="row d-flex justify-content-center text-center">
              <div className="col-lg-8">
                <h1>차량 결함 신고</h1>
                <p className="mb-0">차량 결함에 대한 정보를 입력해주세요.</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="breadcrumbs">
          <div className="container">
            <ol>
              <li><Link to="/">차량리콜도우미</Link></li>
              <li className="current">결함 신고</li>
            </ol>
          </div>
        </nav>
      </div>{/* End Page Title */}

      <section id="defect-report-section" className="defect-report-section section" style={{ padding: '40px 0' }}>
        <div className="container" data-aos="fade-up">
          <div className="section-title text-center"> {/* class="container section-title" -> class="section-title text-center" 로 변경됨 */}
            <h2 className="title">정보 입력</h2>
          </div>

          <div className="widgets-container" style={{ textAlign: 'center' }}>
            <form onSubmit={handleSubmit} className="uk-form-stacked">
              <hr style={{ margin: 'auto' }} /> {/* margin:auto는 block 요소에만 적용되므로, style 속성에 직접 넣는 것이 더 낫습니다. */}

              <table className="uk-table uk-table-divider table-form valickTbl1"
                     style={{ marginLeft: '35%', marginBottom: '5%', marginTop: '5%' }}>
                <colgroup>
                  <col className="th" />
                  <col className="td" />
                </colgroup>
                <tbody>
                  {/* 신고인 정보 */}
                  <tr>
                    <th className="th">신고인<i className="ion-ios7-checkmark-empty"></i></th>
                    <td className="td">
                      <input type="text" id="name" name="reporter_name"
                             className="uk-input uk-form-width-medium"
                             value={formData.reporter_name} onChange={handleChange} required />
                      <input type="hidden" id="sex" name="sex" value={formData.sex} />
                      <input type="hidden" id="ipAddress" name="ipAddress" value={formData.ipAddress} />
                    </td>
                  </tr>
                  <tr>
                    <th className="th">생년월일 (8자리)<i className="ion-ios7-checkmark-empty"></i></th>
                    <td className="td">
                      <input id="residentId" name="birth_date"
                             className="uk-input uk-form-width-medium" type="text"
                             maxLength="8" placeholder="예)99010101"
                             value={formData.birth_date} onChange={handleChange} required />
                    </td>
                  </tr>
                  <tr>
                    <th className="th">휴대폰번호<i className="ion-ios7-checkmark-empty"></i></th>
                    <td className="td phone">
                      <input type="text" id="cellular_display" maxLength="13"
                             className="uk-input reqed" placeholder="예: 010-1234-5678"
                             value={formData.mobile_number_display} onChange={handleMobileNumberChange} required />
                      <input type="hidden" id="mobile_number" name="mobile_number" value={formData.mobile_number} />
                    </td>
                  </tr>
                  <tr>
                    <th className="th">전화번호</th>
                    <td className="td phone">
                      <input type="text" id="telephone_display" maxLength="13"
                             className="uk-input" placeholder="예: 02-1234-5678"
                             value={formData.phone_number_display} onChange={handleTelephoneChange} />
                      <input type="hidden" id="phone_number" name="phone_number" value={formData.phone_number} />
                    </td>
                  </tr>
                  <tr>
                    <th className="th">주소<i className="ion-ios7-checkmark-empty"></i></th>
                    <td className="td addr">
                      {/* 우편번호 찾기 버튼 (Daum Postcode 연동 필요) */}
                      <p>
                        <input id="zipcode" name="zipcode" className="uk-input uk-form-width-medium reqed" title="주소" type="text" readOnly value={formData.zipcode || ''}/>
                        <button type="button" id="zipcodeBtn" onClick={daumPostcode} className="uk-button uk-button-secondary" style={{ marginLeft: '10px' }}>
                          우편번호 찾기
                        </button>
                      </p>
                      <input id="addrBase" name="address" className="uk-input uk-form-width-large" type="text" placeholder="기본주소"
                             value={formData.address} onChange={handleChange} required />
                      {/* <input id="addrDetail" name="address" className="uk-input uk-form-width-large" title="상세주소" type="text" placeholder="상세주소를 입력해주세요" maxLength="70"/> */}
                    </td>
                  </tr>
                  <input type="hidden" id="emailAddress" name="emailAddress" value={formData.emailAddress} />
                  <input type="hidden" name="mailYn" value={formData.mailYn} />

                  <tr>
                    <th className="th">공개여부</th>
                    <td className="td radio">
                      <label htmlFor="podCk1">
                        <input id="podCk1" name="visibility" className="uk-radio" type="radio" value="true"
                               checked={formData.visibility === 'true'} onChange={handleChange} /> 공개
                      </label>
                      <label htmlFor="podCk2" style={{ marginLeft: '15px' }}>
                        <input id="podCk2" name="visibility" className="uk-radio" type="radio" value="false"
                               checked={formData.visibility === 'false'} onChange={handleChange} /> 비공개
                      </label>
                    </td>
                  </tr>

                  <tr className="layerPasswd">
                    <th className="th">비밀번호<i className="ion-ios7-checkmark-empty"></i></th>
                    <td className="td">
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <input id="password" name="password"
                               className="uk-input uk-form-width-medium reqed"
                               onInput={handlePasswordChange}
                               style={{ paddingRight: '30px' }}
                               title="비밀번호"
                               type={showPassword ? 'text' : 'password'}
                               value={formData.password}
                               required />
                        <button type="button" onClick={togglePassword}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}>
                          <i id="eyeIcon" className={`ion-ios-${showPassword ? 'eye-off' : 'eye'}`} style={{ color: 'black' }}></i>
                        </button>
                      </div>
                      <br />
                      {passwordError && <span id="password-msg" className="uk-text-meta" style={{ color: 'red' }}>{passwordError}</span>}
                      <br />
                      <span className="uk-text-meta">
                        비밀번호는 9~15자의 영문/숫자/특수문자(~, !, @, #, $, *, (, ), =, +, _, ., |) 혼용만 가능합니다.
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="uk-table uk-table-divider table-form valickTbl2"
                     style={{ marginLeft: '35%', marginBottom: '5%', marginTop: '5%' }}>
                <h2>자동차 정보 입력</h2>
                <hr />
                <colgroup>
                  <col className="th" />
                  <col className="td" />
                </colgroup>
                <tbody>
                  <tr className="layer0">
                    <th className="th">신고유형<i className="ion-ios7-checkmark-empty"></i></th>
                    <td className="td radio">
                      <label htmlFor="dCk1">
                        <input id="dCk1" name="report_type" className="uk-radio" type="radio" value="A"
                               checked={formData.report_type === 'A'} onChange={handleChange} /> 자동차
                      </label>
                      <label htmlFor="dCk2" style={{ marginLeft: '15px' }}>
                        <input id="dCk2" name="report_type" className="uk-radio" type="radio" value="B"
                               checked={formData.report_type === 'B'} onChange={handleChange} /> 이륜
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <th className="th">자동차 등록번호<i className="ion-ios7-checkmark-empty"></i></th>
                    <td className="td">
                      <input id="vehicleNumber" name="car_registration_number"
                             className="uk-input uk-form-width-medium" type="text"
                             placeholder="예 )서울00나0000"
                             value={formData.car_registration_number} onChange={handleChange} required />
                    </td>
                  </tr>
                  <tr>
                    <th className="th">자동차 모델명<i className="ion-ios7-checkmark-empty"></i></th>
                    <td className="td">
                      <input id="car_model" name="car_model"
                             className="uk-input uk-form-width-medium" type="text"
                             value={formData.car_model} onChange={handleChange} required />
                    </td>
                  </tr>
                  <tr>
                    <th className="th">자동차 제조사<i className="ion-ios7-checkmark-empty"></i></th>
                    <td className="td">
                      <input id="car_manufacturer" name="car_manufacturer"
                             className="uk-input uk-form-width-medium" type="text"
                             value={formData.car_manufacturer} onChange={handleChange} required />
                    </td>
                  </tr>
                  <tr>
                    <th className="th">제조일자<i className="ion-ios7-checkmark-empty"></i></th>
                    <td className="td">
                      <input id="car_manufacturing_date" name="car_manufacturing_date"
                             className="uk-input uk-form-width-medium" type="date"
                             value={formData.car_manufacturing_date} onChange={handleChange} required />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-center">
                {loading && <div className="loading">신고 처리 중...</div>}
                {submitError && <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>{submitError}</div>}
                {submitSuccess && <div className="sent-message" style={{ color: 'green', marginTop: '10px' }}>{submitSuccess}</div>}

                <button type="submit" disabled={loading} style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '20px'
                }}>
                  자동차 결함 신고
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ReportDefectPage;