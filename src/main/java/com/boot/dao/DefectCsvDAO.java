package com.boot.dao;

import java.util.List;
import java.util.Map;

import com.boot.dto.Defect_DetailsDTO;


public interface DefectCsvDAO {
    List<Defect_DetailsDTO> getAllDefects(); 
    
    List<Defect_DetailsDTO> getDefectsByPage(Map<String, Object> params);
    
    void insertDefect(Defect_DetailsDTO defect);
}

