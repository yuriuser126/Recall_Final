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

