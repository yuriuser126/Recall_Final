// src/services/recallApiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8485/api'; // Spring Boot API 기본 URL

// 리콜 목록을 가져오는 함수
export const fetchRecallReports = async (searchCriteria) => {
    try {
        const params = new URLSearchParams();
        for (const key in searchCriteria) {
            if (searchCriteria[key] !== '' && searchCriteria[key] !== null && searchCriteria[key] !== undefined) {
                params.append(key, searchCriteria[key]);
            }
        }
        // 예시: GET /api/recall_list?pageNum=1&amount=10&type=&keyword=
        const response = await axios.get(`${API_BASE_URL}/recall_list?${params.toString()}`);
        return response.data; // { list: [...], pageMaker: {...} } 형태를 예상
    } catch (error) {
        console.error("Failed to fetch recall reports:", error);
        throw error;
    }
};

// 리콜 상세 정보를 가져오는 함수 (필요시 추가)
export const fetchRecallDetail = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/recall_detail/${id}`);
        return response.data; // 단일 DTO 객체를 예상
    } catch (error) {
        console.error(`Failed to fetch recall detail for ID ${id}:`, error);
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