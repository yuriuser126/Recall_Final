package com.boot.dao;

import java.util.ArrayList;
import java.util.HashMap;

import com.boot.dto.DefectListDTO;

public interface DefectListDAO {
	public ArrayList<DefectListDTO> defectList();
//	public void write(HashMap<String, String> param);
//	public void write(DefectListDTO defectListDTO);
	public DefectListDTO defectView(Long id);
	public DefectListDTO defect_modify(HashMap<String, String> param);
	public void modify(DefectListDTO DefectListDTO);
	public void delete(Long id);
	public DefectListDTO getById(int id);

}















