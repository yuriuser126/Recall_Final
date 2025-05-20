// services/announceService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8485/api';

 // 공지사항전체
export const fetchAnnouncements = async (params) => {
  try {
    // 예시: /api/announcements?pageNum=1&amount=10&type=T&keyword=제목
    const response = await axios.get(`${API_BASE_URL}/announce`, { params });
    return response.data; // 서버에서 받은 데이터 (list와 pageMaker 정보 포함)
  } catch (error) {
    console.error('공지사항 데이터를 가져오는 데 실패했습니다:', error);
    throw error; 
  }
};

// **상세 공지사항 **
export const fetchAnnouncementDetail = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/announce/${id}`);
    return response.data;
  } catch (error) {
    console.error(`공지사항 상세 데이터(ID: ${id})를 가져오는 데 실패했습니다:`, error);
    throw error;
  }
};