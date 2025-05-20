// src/services/defectApiService.js
import axios from 'axios';
// format은 이제 여기서 직접 사용하지 않으므로 제거해도 됩니다.
// import { format } from 'date-fns';

const API_BASE_URL = 'http://localhost:8485/api';

export const fetchDefectReports = async (searchCriteria) => {
    try {
        const params = new URLSearchParams();
        for (const key in searchCriteria) {
            // 빈 문자열, null, undefined 값은 쿼리 파라미터에 추가하지 않음
            if (searchCriteria[key] !== '' && searchCriteria[key] !== null && searchCriteria[key] !== undefined) {
                // reportDate는 이미 'yyyy-MM-dd' 문자열로 넘어오므로 별도 포맷팅 불필요
                // 단, 날짜가 'Invalid Date' 같은 상태로 들어오면 문제가 될 수 있으므로,
                // DefectReportList.js에서 이미 유효한 날짜 문자열로 변환했다고 가정합니다.
                // Spring Boot의 @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)에 맞게 yyyy-MM-dd 형식이어야 함
                params.append(key, searchCriteria[key]);
            }
        }

        const response = await axios.get(`${API_BASE_URL}/defect_list?${params.toString()}`);
        return response.data; // { list: [...], pageMaker: {...} } 형태를 예상
    } catch (error) {
        console.error("Failed to fetch defect reports:", error);
        throw error; // 오류를 다시 던져서 DefectReportList.js에서 catch하도록 함
    }
};

// 결함 상세 정보 
export const fetchDefectDetail = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/defect_detail/${id}`);
        return response.data; // 서버에서 단일 DTO 객체를 반환한다고 가정
    } catch (error) {
        console.error(`Failed to fetch defect detail for ID ${id}:`, error);
        throw error;
    }
};

// 필요한 경우, 결함 신고 POST API도 여기에 추가
export const submitNewDefectReport = async (reportData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/defect_reports_ok`, reportData);
        return response.data;
    } catch (error) {
        console.error("Failed to submit defect report:", error);
        throw error;
    }
};
// 비밀번호 확인 API (이전 답변에서 추가했던 함수)
export const checkPassword = async (id, password) => {
    try {
        // 서버의 엔드포인트와 요청 바디 형식을 확인해야 합니다.
        // Spring Boot 컨트롤러에서 @RequestBody Map<String, String> request 로 받으므로
        // { id, password } 객체를 보내는 것이 일반적입니다.
        const response = await axios.post(`${API_BASE_URL}/defect_pwcheck`, { id: id, password: password });
        return response.data; // 서버에서 true/false 값을 반환한다고 가정
    } catch (error) {
        console.error(`비밀번호 확인 실패:`, error);
        throw error; // 오류를 상위 컴포넌트로 던져서 처리하도록 함
    }
};

// 결함 보고서 수정 API
export const updateDefectReport = async (defectData) => {
    try {
        // PUT 요청으로 보냅니다. Spring Boot의 @PutMapping과 매핑됩니다.
        const response = await axios.put(`${API_BASE_URL}/defect_modify`, defectData);
        return response.data; // 서버에서 성공/실패 메시지 또는 상태를 반환할 수 있습니다.
    } catch (error) {
        console.error(`결함 보고서 수정 실패 (ID: ${defectData.id}):`, error);
        throw error;
    }
};

// 결함 보고서 삭제 API
export const deleteDefectReport = async (id) => {
    try {
        // DELETE 요청으로 보냅니다. Spring Boot의 @DeleteMapping과 매핑됩니다.
        const response = await axios.delete(`${API_BASE_URL}/defect_delete/${id}`);
        return response.data; // 서버에서 성공/실패 메시지 또는 상태를 반환할 수 있습니다.
    } catch (error) {
        console.error(`결함 보고서 삭제 실패 (ID: ${id}):`, error);
        throw error;
    }
};
