import { useState } from 'react';
import { fetchDefectReportById, saveDefectDetails } from '../services/recallApiService';

const initialState = {
  id: '',
  product_name1: '',
  product_name: '',
  manufacturer: '',
  start_date: '',
  end_date: '',
  manufacturing_period: '',
  model_name: '',
  recall_type: '자발적리콜',
  company_select: '',
  contact_info: '',
  contact_number: '',
  additional_info: '',
};

const companyNumbers = {
  '[볼보자동차]': '1588-1777',
  '[마세라티]': '1600-0036',
  '[벤츠코리아]': '080-001-1886',
  '[볼보트럭]': '080-038-1000',
  '[현대자동차]': '080-600-6000',
};

function formatDateToYYMMDD(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + month + day;
}

const DefectDetailsCheckPage = () => {
  const [form, setForm] = useState(initialState);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ID 검색
  const handleSearchDefect = async () => {
    if (!form.id) {
      alert('아이디를 입력해 주세요.');
      return;
    }
    setSearchLoading(true);
    setSearchError('');
    try {
      console.log('[PAGE] handleSearchDefect 호출, id:', form.id);
      const data = await fetchDefectReportById(form.id);
      console.log('[PAGE] fetchDefectReportById 결과:', data);
      if (data) {
        setForm(f => ({
          ...f,
          id: data.id || '',
          manufacturer: data.car_manufacturer || '',
          model_name: data.car_model || '',
        }));
      } else {
        alert('해당 ID의 데이터를 찾을 수 없습니다.');
      }
    } catch (e) {
      setSearchError('데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setSearchLoading(false);
    }
  };

  // 날짜 변경 핸들러
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setForm(f => {
      const updated = { ...f, [name]: value };
      if (updated.start_date && updated.end_date) {
        updated.manufacturing_period = `${formatDateToYYMMDD(updated.start_date)}~${formatDateToYYMMDD(updated.end_date)}`;
      } else {
        updated.manufacturing_period = '';
      }
      return updated;
    });
  };

  // 회사 선택 핸들러
  const handleCompanyChange = (e) => {
    const company = e.target.value;
    const number = companyNumbers[company] || '';
    setForm(f => ({
      ...f,
      company_select: company,
      contact_number: number,
      contact_info: company ? `${company} 대표번호 : ${number}` : '',
    }));
  };

  // 기타 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    try {
      const result = await saveDefectDetails(form);
      setSuccessMsg(result === 'success' ? '검수 완료! (DB 저장 성공)' : '저장 실패: ' + result);
    } catch (err) {
      setSuccessMsg('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2 style={{ margin: '32px 0 16px' }}>신고 내역 검수</h2>
      <form onSubmit={handleSubmit} className="uk-form-stacked">
        <table className="uk-table table-form" style={{ marginBottom: 32 }}>
          <tbody>
            <tr>
              <th className="th">아이디</th>
              <td className="td">
                <input type="text" name="id" value={form.id} onChange={handleChange} placeholder="아이디를 입력하세요" className="uk-input uk-form-width-medium" />
                <button type="button" onClick={handleSearchDefect} style={{ marginLeft: 8 }} disabled={searchLoading}>
                  {searchLoading ? '검색 중...' : '검색'}
                </button>
                {searchError && <span style={{ color: 'red', marginLeft: 8 }}>{searchError}</span>}
              </td>
            </tr>
            <tr>
              <th className="th">리콜정보</th>
              <td className="td">
                <select name="product_name1" value={form.product_name1} onChange={handleChange} className="uk-select">
                  <option value="">선택</option>
                  <option value="볼보">볼보</option>
                  <option value="마세라티">마세라티</option>
                  <option value="벤츠">벤츠</option>
                  <option value="볼보트럭">볼보트럭</option>
                  <option value="현대자동차">현대자동차</option>
                </select>
                <input name="product_name" value={form.product_name} onChange={handleChange} className="uk-input uk-form-width-medium" type="text" maxLength={7} placeholder="예)계기판 관련 리콜" style={{ marginLeft: 8 }} />
              </td>
            </tr>
            <tr>
              <th className="th">자동차 제조사</th>
              <td className="td">
                <input name="manufacturer" value={form.manufacturer} onChange={handleChange} className="uk-input uk-form-width-medium" type="text" placeholder="예)볼보 자동차 코리아" readOnly />
              </td>
            </tr>
            <tr>
              <th className="th">기간</th>
              <td className="td">
                <input name="start_date" value={form.start_date} onChange={handleDateChange} className="uk-input uk-form-width-small" type="date" />
                ~
                <input name="end_date" value={form.end_date} onChange={handleDateChange} className="uk-input uk-form-width-small" type="date" style={{ marginLeft: 8 }} />
                <span style={{ marginLeft: 10, fontWeight: 'bold' }}>{form.manufacturing_period}</span>
                <input type="hidden" name="manufacturing_period" value={form.manufacturing_period} />
              </td>
            </tr>
            <tr>
              <th className="th">자동차 모델명</th>
              <td className="td">
                <input name="model_name" value={form.model_name} onChange={handleChange} className="uk-input uk-form-width-medium" type="text" />
              </td>
            </tr>
            <tr>
              <th className="th">리콜 형식</th>
              <td className="td">
                <input name="recall_type" value={form.recall_type} className="uk-input uk-form-width-medium" type="text" readOnly />
              </td>
            </tr>
            <tr>
              <th className="th">회사(대표번호)</th>
              <td className="td">
                <select name="company_select" value={form.company_select} onChange={handleCompanyChange} className="uk-select">
                  <option value="">회사 선택</option>
                  <option value="[볼보자동차]">[볼보자동차]</option>
                  <option value="[마세라티]">[마세라티]</option>
                  <option value="[벤츠코리아]">[벤츠코리아]</option>
                  <option value="[볼보트럭]">[볼보트럭]</option>
                  <option value="[현대자동차]">[현대자동차]</option>
                </select>
                <input name="contact_number" value={form.contact_number} onChange={handleChange} className="uk-input uk-form-width-medium" type="text" maxLength={20} placeholder="예)볼보자동차 대표번호 1588-1777" style={{ marginLeft: 8 }} />
                <input type="hidden" name="contact_info" value={form.contact_info} />
              </td>
            </tr>
            <tr>
              <th className="th">상세 결함</th>
              <td className="td">
                <textarea name="additional_info" value={form.additional_info} onChange={handleChange} className="uk-input uk-form-width-medium" rows={4} style={{ resize: 'vertical' }} />
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ textAlign: 'center' }}>
          <button type="submit" style={{ padding: '10px 32px', fontSize: 16, borderRadius: 5, backgroundColor: '#00796b', color: 'white', border: 'none' }}>
            검수 완료
          </button>
        </div>
        {successMsg && <div style={{ color: 'green', textAlign: 'center', marginTop: 16 }}>{successMsg}</div>}
      </form>
    </div>
  );
};

export default DefectDetailsCheckPage;
