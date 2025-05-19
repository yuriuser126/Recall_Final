package com.boot.service;

import java.util.ArrayList;

import com.boot.dto.Criteria;
import com.boot.dto.DefectListDTO;

public interface PageService {
	public ArrayList<DefectListDTO> listWithPaging(Criteria cri);
	public int getTotalCount(Criteria cri);
}
