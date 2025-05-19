package com.boot.service;

import java.util.List;
import com.boot.dto.Defect_DetailsDTO;

import lombok.extern.slf4j.Slf4j;


public interface DefectCsvService {
    List<Defect_DetailsDTO> getDefectList();

	List<Defect_DetailsDTO> getAllDefects();
	//오류로 추가 (서비스 임플에서 두개 처리)
	
	List<Defect_DetailsDTO> getDefectsByPage(int pageNum, int amount);

	
	void saveDefects(List<Defect_DetailsDTO> defects);
	
	 // ✅ 외부 API로부터 데이터 가져오기
    List<Defect_DetailsDTO> fetchFromOpenAPI();
}
