package com.boot.service;

import java.util.List;

import com.boot.dto.Defect_DetailsDTO;
import com.boot.dto.Defect_ReportsDTO;

public interface DefactService {
	public void insertDefect(Defect_ReportsDTO defect_ReportsDTO);
	public List<Defect_ReportsDTO> selectDefectreport(int id);
	public void insertDefectDetails(Defect_DetailsDTO defect_DetailsDTO);
//	public void insertcarDefect(Defect_ReportsDTO defect_ReportsDTO);
}
