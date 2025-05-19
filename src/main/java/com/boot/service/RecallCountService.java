package com.boot.service;

import java.util.List;
import java.util.Map;

import com.boot.dto.RecallCountDTO;

public interface RecallCountService {
	List<RecallCountDTO> getRepeatedModels();
}
