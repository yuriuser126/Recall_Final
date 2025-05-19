package com.boot.service;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import com.boot.dao.RecallCountDAO;
import com.boot.dto.Defect_DetailsDTO;
import com.boot.dto.RecallCountDTO;
import com.boot.service.RecallServiceImpl.XmlParserUtil;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("RecallCountService")
public class RecallCountServiceImpl implements RecallCountService {

	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public List<RecallCountDTO> getRepeatedModels() {
		
		RecallCountDAO dao = sqlSession.getMapper(RecallCountDAO.class);
        List<String> modelNmList = dao.getAllModelNames();

        Map<String, Integer> countMap = new HashMap<>();
        for (String raw : modelNmList) {
            if (raw != null) {
                for (String model : raw.split(",")) {
                    model = model.trim();
                    countMap.put(model, countMap.getOrDefault(model, 0) + 1);
                }
            }
        }

        List<RecallCountDTO> result = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : countMap.entrySet()) {
            if (entry.getValue() > 1) {
                result.add(new RecallCountDTO(entry.getKey(), entry.getValue()));
            }
        }

        result.sort((a, b) -> Integer.compare(b.getCount(), a.getCount()));
        return result;
    }


}
