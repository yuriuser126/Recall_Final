package com.boot.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.boot.dto.Criteria;
import com.boot.dto.DefectReportSummaryDTO;
import com.boot.dto.Defect_DetailsDTO;
import com.boot.dto.ManufacturerRecallDTO;

@Mapper
public interface RecallStaticDAO {
	DefectReportSummaryDTO getdefect_reports_count(Map<String, Object> paramMap);
	public List<DefectReportSummaryDTO> getDefectReportSummaryByYear(Map<String, Object> paramMap);
	List<ManufacturerRecallDTO> getYearlyRecallStats(@Param("startYear") int startYear, @Param("endYear") int endYear);
	List<DefectReportSummaryDTO> getDefectReportSummaryByMonth(Map<String, Object> paramMap);
	List<ManufacturerRecallDTO> getYearlyRecallStatsByMonth(Map<String, Object> paramMap);
	
	int checkDuplicate(Defect_DetailsDTO dto);
	void insertDefect(Defect_DetailsDTO dto);
	
	
	Defect_DetailsDTO findByKey(Defect_DetailsDTO dto);
	void updateDefect(Defect_DetailsDTO dto);
	List<Defect_DetailsDTO> getAllRecalls();
	Defect_DetailsDTO findById(int id);

	List<Defect_DetailsDTO> getListWithPaging(Criteria cri);
	int getTotalCount(Criteria cri);
}















