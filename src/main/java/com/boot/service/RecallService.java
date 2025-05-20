package com.boot.service;

import java.util.List;
import java.util.Map;

import com.boot.dto.Criteria;
import com.boot.dto.DefectReportSummaryDTO;
import com.boot.dto.Defect_DetailsDTO;
import com.boot.dto.ManufacturerRecallDTO;
import com.boot.dto.SyncDTO;

public interface RecallService {
    List<Defect_DetailsDTO> getProductList(Criteria cri, String cntntsId) throws Exception;
    public List<DefectReportSummaryDTO> getDefectReportSummaryByYear(Map<String, Object> paramMap);
    int getTotalCount(Criteria cri, String cntntsId) throws Exception;
    String fetchXmlFromApi(Criteria cri, String cntntsId) throws Exception;
    DefectReportSummaryDTO getDefectReportSummary(Map<String, Object> paramMap);
    List<ManufacturerRecallDTO> getYearlyRecallStats(int startYear, int endYear);
//    int getdefect_reports_count(Integer startYear, Integer endYear);
    List<DefectReportSummaryDTO> getDefectReportSummaryByMonth(Map<String, Object> paramMap);
    List<ManufacturerRecallDTO> getYearlyRecallStatsByMonth(Map<String, Object> paramMap);
    
    void saveApiDataToDB(List<Defect_DetailsDTO> apiList); // DB 저장
    SyncDTO syncApiDataWithDB(List<Defect_DetailsDTO> apiList); // DB 동기화

    List<Defect_DetailsDTO> getAllRecalls(); // DB의 recall 모두 select
    Defect_DetailsDTO getRecallById(int id); // DB의 recall 하나를 id 기반 select
    List<Integer> getSimilarRecallIds(int targetId); // 유사 리콜 id 추천
	List<Defect_DetailsDTO> getAllRecallByCri(Criteria cri); // DB의 recall 모두 cri 기반 select
	int getRecallTotalCount(Criteria cri);    

}
