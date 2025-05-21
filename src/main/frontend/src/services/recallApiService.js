// src/services/recallApiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8485/api'; 

// 리콜 목록을 가져오는 함수 (검색 조건 포함)
export const fetchRecallReports = async (searchCriteria) => {
    try {
        const params = new URLSearchParams();
        // searchCriteria의 모든 유효한 속성을 URL 파라미터로 추가
        for (const key in searchCriteria) {
            if (searchCriteria[key] !== '' && searchCriteria[key] !== null && searchCriteria[key] !== undefined) {
                params.append(key, searchCriteria[key]);
            }
        }
        // 예시: GET /api/recall_list?pageNum=1&amount=10&type=manufacturer&keyword=현대
        const response = await axios.get(`${API_BASE_URL}/recall_list?${params.toString()}`);
        return response.data; // { list: [...], pageMaker: {...} } 형태를 예상
    } catch (error) {
        console.error("Failed to fetch recall reports:", error);
        throw error;
    }
};
/**
 * 특정 ID의 리콜 상세 정보를 가져옵니다.
 * @param {string} id 조회할 리콜 ID
 * @returns {Promise<{recall: object, similarIds: string[]}>} 리콜 상세 정보 및 유사 리콜 ID 목록
 */
export const fetchRecallDetail = async (id) => {
    try {
        // 예시: GET /api/recall_detail/123
        const response = await axios.get(`${API_BASE_URL}/recall_detail/${id}`);
        // 서버 응답 형태를 { recall: { ... }, similarIds: [...] } 로 가정합니다.
        // 실제 서버 응답 형태에 따라 이 부분을 조정해야 합니다.
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch recall detail for ID ${id}:`, error);
        throw error;
    }
};

/**
 * 결함 상세 조회 (ID로)
 */
export const fetchDefectDetail = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/defect_detail/${id}`);
        return response.data; // { defect: {...} }
    } catch (error) {
        console.error(`Failed to fetch defect detail for ID ${id}:`, error);
        throw error;
    }
};

/**
 * 결함 상세 정보 저장/수정 (검수 완료)
 */
export const saveDefectDetails = async (formData) => {
    try {
        // formData는 객체 형태, 필요시 FormData로 변환
        const response = await axios.post(`${API_BASE_URL}/insertDefectDetails`, formData);
        return response.data;
    } catch (error) {
        console.error('Failed to save defect details:', error);
        throw error;
    }
};

// CSV 전체 다운로드 함수
export const downloadRecallCsv = async () => {
    try {
        // 서버에서 파일을 직접 다운로드하도록 설정 (blob 타입으로 응답 받기)
        const response = await axios.get(`${API_BASE_URL}/recall/downloadCsv`, {
            responseType: 'blob', // 중요한 설정: 바이너리 데이터를 받기 위함
        });

        // 파일 다운로드 로직
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'recall_list.csv'); // 다운로드될 파일 이름 설정
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // URL 해제
    } catch (error) {
        console.error("Failed to download CSV:", error);
        throw error;
    }
};

// 엑셀 전체 다운로드 함수
export const downloadRecallExcel = async () => {
    try {
        // 서버에서 파일을 직접 다운로드하도록 설정 (blob 타입으로 응답 받기)
        const response = await axios.get(`${API_BASE_URL}/recall/downloadExcel`, {
            responseType: 'blob', // 중요한 설정: 바이너리 데이터를 받기 위함
        });

        // 파일 다운로드 로직
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'recall_list.xlsx'); // 다운로드될 파일 이름 설정
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // URL 해제
    } catch (error) {
        console.error("Failed to download Excel:", error);
        throw error;
    }
};

/**
 * ID로 결함신고 상세 조회
 * @param {number|string} id
 * @returns {Promise<Object>} 결함신고 상세 데이터
 */
export const fetchDefectReportById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/selectDefectreport`, { params: { id } });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; // 데이터 없음
        }
        console.error(`Failed to fetch defect report for ID ${id}:`, error);
        throw error;
    }
};

