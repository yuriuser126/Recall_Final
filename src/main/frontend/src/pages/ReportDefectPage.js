// src/pages/ReportDefectPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useForm } from '../hooks/useForm';
import { formatPhoneNumber, formatTelephoneNumber, validatePassword } from '../utils/formInputFormatters';

function ReportDefectPage() {
  const navigate = useNavigate();

  const { formData, setFormData, handleChange } = useForm({
    reporter_name: '',
    sex: 'F',
    ipAddress: '1.220.191.166',
    birth_date: '',
    mobile_number_display: '',
    mobile_number: '',
    phone_number_display: '',
    phone_number: '',
    address: '',
    emailAddress: '',
    mailYn: 'N',
    visibility: 'true',
    password: '',
    report_type: 'A',
    car_registration_number: '',
    car_model: '',
    car_manufacturer: '',
    car_manufacturing_date: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null); // 이 변수도 사용되도록 아래 JSX에 추가됨

  const handleMobileNumberChange = (e) => {
    const displayValue = formatPhoneNumber(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      mobile_number_display: displayValue,
      mobile_number: displayValue.replace(/-/g, ''),
    }));
  };

  const handleTelephoneChange = (e) => {
    const displayValue = formatTelephoneNumber(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      phone_number_display: displayValue,
      phone_number: displayValue.replace(/-/g, ''),
    }));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      password: newPassword,
    }));
    const { isValid, message } = validatePassword(newPassword);
    setPasswordError(message);
  };

  const togglePassword = () => { // 이 함수도 사용되도록 아래 JSX에 추가됨
    setShowPassword((prev) => !prev);
  };

  const daumPostcode = () => { // 이 함수도 사용되도록 아래 JSX에 추가됨
    new window.daum.Postcode({
      oncomplete: function(data) {
        let fullAddress = data.address;
        let extraAddress = '';
        if (data.addressType === 'R') {
          if (data.bname !== '') { extraAddress += data.bname; }
          if (data.buildingName !== '') { extraAddress += (extraAddress !== '' ? ', ' : '') + data.buildingName; }
          fullAddress += (extraAddress !== '' ? ' (' + extraAddress + ')' : '');
        }
        setFormData(prevData => ({
          ...prevData,
          address: fullAddress,
          zipcode: data.zonecode,
        }));
      }
    }).open();
  };

  const handleSubmit = async (e) => { // 이 함수도 사용되도록 아래 JSX에 추가됨
    e.preventDefault();
    const { reporter_name, birth_date, mobile_number, address, password, car_registration_number, car_model, car_manufacturer } = formData;

    if (!reporter_name || !birth_date || !mobile_number || !address || !password || !car_registration_number || !car_model || !car_manufacturer) {
        setSubmitError("모든 필수 내용을 입력하셔야 합니다.");
        return;
    }

    const { isValid: isPasswordValid } = validatePassword(password);
    if (!isPasswordValid) {
        setSubmitError("비밀번호 형식이 올바르지 않습니다.");
        return;
    }

    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const API_URL = 'http://localhost:8485/api/defect_reports_ok';
      const dataToSend = { ...formData };
      delete dataToSend.mobile_number_display;
      delete dataToSend.phone_number_display;

      const response = await axios.post(API_URL, dataToSend);
      setSubmitSuccess(response.data || '결함 신고가 성공적으로 접수되었습니다.');
      setTimeout(() => {
        navigate('/defect_reports_ok');
      }, 1500);
    } catch (err) {
      setSubmitError(err.response?.data || err.message || '결함 신고 중 오류가 발생했습니다.');
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
          <div className="section-title text-center">
            <h2 className="title">정보 입력</h2>
          </div>

          <div className="widgets-container" style={{ textAlign: 'center' }}>
            {/* 폼 제출 핸들러 연결 */}
            <form onSubmit={handleSubmit} className="uk-form-stacked">
              <hr style={{ margin: 'auto' }} />

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
                      <p>
                        <input id="zipcode" name="zipcode" className="uk-input uk-form-width-medium reqed" title="주소" type="text" readOnly value={formData.zipcode || ''}/>
                        <button type="button" id="zipcodeBtn" onClick={daumPostcode} className="uk-button uk-button-secondary" style={{ marginLeft: '10px' }}>
                          우편번호 찾기
                        </button>
                      </p>
                      <input id="addrBase" name="address" className="uk-input uk-form-width-large" type="text" placeholder="기본주소"
                             value={formData.address} onChange={handleChange} required />
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

              <h2>자동차 정보 입력</h2>
              <table className="uk-table uk-table-divider table-form valickTbl2"
                     style={{ marginLeft: '35%', marginBottom: '5%', marginTop: '5%' }}>
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