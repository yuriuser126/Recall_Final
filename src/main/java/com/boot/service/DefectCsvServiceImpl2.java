//package com.boot.service;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//import org.apache.ibatis.session.SqlSession;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.boot.dao.DefectCsvDAO;
//import com.boot.dto.Defect_DetailsDTO;
//
//import lombok.extern.slf4j.Slf4j;
//
//@Slf4j
//@Service("DefectCsvService")
//public class DefectCsvServiceImpl2 implements DefectCsvService{
//	
//	@Autowired
//	private SqlSession sqlSession;
//	
//	 @Autowired
//	private DefectCsvDAO defectCsvDAO;  
//
//	@Override
//	public List<Defect_DetailsDTO> getAllDefects() {
//	    // DB에서 전체 결함 데이터를 조회하는 로직
//	    return defectCsvDAO.getAllDefects();  // DAO에 전체 조회 메서드가 있어야 함
//	}
//	
//	 @Override
//	    public List<Defect_DetailsDTO> getDefectList() {
//	        return getAllDefects();  // DAO 인터페이스의 메서드를 내부에서 호출
//	    }
//
//    @Override
//    public List<Defect_DetailsDTO> getDefectsByPage(int pageNum, int amount) {
//    	
//        int offset = (pageNum - 1) * amount;
//        log.info("getDefectsByPage 호출 - pageNum: {}, amount: {}, offset: {}", pageNum, amount, offset);
//        Map<String, Object> params = new HashMap<>();
//        params.put("offset", offset);
//        params.put("limit", amount);
//        List<Defect_DetailsDTO> list = defectCsvDAO.getDefectsByPage(params);
//        log.info("조회된 데이터 개수: {}", list.size());
//        return list;
//    }
//
//	@Override
//	public void saveDefects(List<Defect_DetailsDTO> defects) {
//	    for (Defect_DetailsDTO defect : defects) {
//	        defectCsvDAO.insertDefect(defect); // 이 메소드가 있어야 함
//	    }
//	}
//
//	@Override
//	public List<Defect_DetailsDTO> fetchFromOpenAPI() {
//		 // 외부 API 호출 → XML 파싱 → List<Defect_DetailsDTO> 리턴
//        List<Defect_DetailsDTO> parsedList = new ArrayList<>();
//        // 예: XML 파싱 로직 구현
//        return parsedList;
//	}
//
//
//	
//
//	
//	
//}
