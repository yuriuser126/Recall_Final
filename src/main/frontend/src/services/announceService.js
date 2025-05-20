// services/announceService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8485/api'; // 실제 Spring Boot API 주소에 맞춰 변경

export const fetchAnnouncements = async (params) => {
  try {
    // 예시: /api/announcements?pageNum=1&amount=10&type=T&keyword=제목
    const response = await axios.get(`${API_BASE_URL}/announce`, { params });
    return response.data; // 서버에서 받은 데이터 (list와 pageMaker 정보 포함)
  } catch (error) {
    console.error('공지사항 데이터를 가져오는 데 실패했습니다:', error);
    throw error; // 에러를 호출자에게 전달
  }
};