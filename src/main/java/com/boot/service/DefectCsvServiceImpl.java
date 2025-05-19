package com.boot.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.dao.DefectCsvDAO;
import com.boot.dto.Defect_DetailsDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("DefectCsvService")
public class DefectCsvServiceImpl implements DefectCsvService{
	
	@Autowired
	private SqlSession sqlSession;
	
	 @Autowired
	private DefectCsvDAO defectCsvDAO;  

	@Override
	public List<Defect_DetailsDTO> getAllDefects() {
		 // XML 파싱 로직 (여기선 예시 데이터)
        List<Defect_DetailsDTO> list = new ArrayList<>();
//        list.add(new Defect_DetailsDTO(1, "공기청정기", "Samsung", "2023-01", "AirPure", "의무", "080-111-2222", "모터 과열"));
        return list;
	}
	
	 @Override
	    public List<Defect_DetailsDTO> getDefectList() {
	        return getAllDefects();  // DAO 인터페이스의 메서드를 내부에서 호출
	    }

	@Override
	public List<Defect_DetailsDTO> getDefectsByPage(int pageNum, int amount) {
		 int offset = (pageNum - 1) * amount;
		 log.info("페이징 쿼리 실행 - pageNum: {}, amount: {}, offset: {}", pageNum, amount, offset);
		 log.info("offset: {}", offset);
		 
	    Map<String, Object> params = new HashMap<>();
	    params.put("offset", offset);
	    params.put("limit", amount);
	    return defectCsvDAO.getDefectsByPage(params);
	}

	@Override
	public void saveDefects(List<Defect_DetailsDTO> defects) {
	    for (Defect_DetailsDTO defect : defects) {
	        defectCsvDAO.insertDefect(defect); // 이 메소드가 있어야 함
	    }
	}

	@Override
	public List<Defect_DetailsDTO> fetchFromOpenAPI() {
		 // 외부 API 호출 → XML 파싱 → List<Defect_DetailsDTO> 리턴
        List<Defect_DetailsDTO> parsedList = new ArrayList<>();
        // 예: XML 파싱 로직 구현
        return parsedList;
	}


	

	
	
}
