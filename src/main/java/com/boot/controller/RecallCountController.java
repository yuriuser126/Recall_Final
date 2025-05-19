package com.boot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.boot.dto.RecallCountDTO;
import com.boot.service.RecallCountService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
//@RequestMapping("/recallCount")
public class RecallCountController {

	@Autowired
	private RecallCountService service;
	
	@RequestMapping(value ="/repeatedModels", method =RequestMethod.GET)
	public String showRepeatedModels(Model model) {
		log.info("@#repeatedModels");
		List<RecallCountDTO> repeatedModels = service.getRepeatedModels();
		log.info("@#반복 모델 수:", repeatedModels.size());
		log.info("@#반복 내용", repeatedModels);
		model.addAttribute("repeatedModels", repeatedModels);
		return "repeatedModels";
	}
}
