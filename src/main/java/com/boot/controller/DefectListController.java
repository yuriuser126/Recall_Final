package com.boot.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.boot.dto.DefectListDTO;
import com.boot.service.DefectListService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class DefectListController {

	@Autowired
	private DefectListService defectListservice;


	//해당 게시글 보기
	@RequestMapping("/defect_view")
	public String defect_view(@RequestParam HashMap<String, String> param, Model model) {
		log.info("@# defect_view()");
		log.info("@# param: "+param);
		
		DefectListDTO dto = defectListservice.defectView(param);
		model.addAttribute("defect_view", dto);
		

		
		return "defect_view";
	}
	//비밀번호 체크 화면
	@RequestMapping("/pwCheck")
	public String pwCheck(@RequestParam HashMap<String, String> param, Model model) {
		log.info("@# pwCheck()");
		log.info("@# param: "+param);

		return "pwCheck";
	}
	
	//비밀번호 체크
	@RequestMapping(value ="/checkPassword", method=RequestMethod.POST)
	@ResponseBody
	public String checkPassword(@RequestBody Map<String, String> param){
		log.info("@# checkPassword()");
		String password = param.get("password");
		log.info("@# password: "+password);
		int id = Integer.parseInt(param.get("id")) ;
		log.info("@# id: "+id);

	
		DefectListDTO dto = defectListservice.getById(id);
		if (dto != null && password.equals(dto.getPassword())) {
			return "success";
		} else {
			return "fail";

		}

	}
	
	//수정 화면
	@RequestMapping("/defect_modify")
	public String defect_modify(@RequestParam HashMap<String, String> param, Model model) {
		log.info("@# defect_modify()");
		log.info("@# param: "+param);
		log.info("@# id: "+param.get("id"));
		DefectListDTO dto = defectListservice.defect_modify(param);
		model.addAttribute("defect_modify", dto);

		return "defect_modify";
	}
	

	//수정
	@RequestMapping("/modify")
	public String modify(@RequestParam HashMap<String, String> param) {
		log.info("@# modify()");
		defectListservice.modify(param);
		
		return "redirect:defectList";
	}
	
	//삭제
	@RequestMapping("/delete")
	public String delete(@RequestParam HashMap<String, String> param) {
		log.info("@# delete()");
		log.info("@# param(보드넘버가 필요해용) "+param);
		log.info("@# param.get(\"id\") => "+param.get("id"));

		defectListservice.delete(param);

//		
		return "redirect:defectList";
	}

}







