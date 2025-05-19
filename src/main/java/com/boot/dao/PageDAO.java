package com.boot.dao;

import java.util.ArrayList;

import com.boot.dto.Criteria;
import com.boot.dto.DefectListDTO;

public interface PageDAO {
	public ArrayList<DefectListDTO> listWithPaging(Criteria cri);
	public int getTotalCount(Criteria cri);
}















