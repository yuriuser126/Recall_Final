package com.boot.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // ResponseEntity 사용을 위해 추가
import org.springframework.http.ResponseEntity; // ResponseEntity 사용을 위해 추가
import org.springframework.stereotype.Controller; // 기존 어노테이션 유지
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin; // CORS 설정을 위해 추가
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping; // POST 요청 처리를 위해 추가
import org.springframework.web.bind.annotation.RequestBody; // JSON 요청 바디를 받기 위해 추가
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.boot.dto.AnnounceDTO;
import com.boot.dto.Criteria;
import com.boot.dto.DefectListDTO;
import com.boot.dto.Defect_DetailsDTO;
import com.boot.dto.Defect_ReportsDTO; // DTO 임포트 확인
import com.boot.dto.PageDTO;
import com.boot.service.DefactService;
import com.boot.service.DefectListService;
import com.boot.service.PageService;

import lombok.extern.slf4j.Slf4j;

@Controller 
@Slf4j
@RequestMapping("/api")
@RestController
public class ReactDefectController {
	@Autowired
    private DefactService defactservice;

	@Autowired
	private DefectListService defectListservice;
	
	@Autowired
	private PageService pageService;
	
    // 기존 insertDefect (HTML 폼 제출용)
    @RequestMapping("/insertDefect")
    public String insertDefect(Defect_ReportsDTO defect_ReportsDTO) {
        log.info("@# insertDefect() (Legacy HTML Form) => {}", defect_ReportsDTO);
        defactservice.insertDefect(defect_ReportsDTO);
        return "redirect:defect_reports_ok";
    }

    /**
     * React 프론트엔드에서 차량 결함 신고를 POST 요청으로 처리하는 REST API.
     * JSON 데이터를 Defect_ReportsDTO 객체로 매핑합니다.
     *
     * @param defect_ReportsDTO React에서 전송된 결함 신고 데이터
     * @return 성공 또는 실패 메시지를 담은 ResponseEntity
     */
    @PostMapping("/defect_reports_ok") // React에서 호출할 엔드포인트
    public ResponseEntity<String> submitDefectReport(@RequestBody Defect_ReportsDTO defect_ReportsDTO) {
        log.info("@# submitDefectReport() (React API) => {}", defect_ReportsDTO);

        // 여기에서 Defect_ReportsDTO의 유효성 검사 (예: 필수 필드 누락 여부)를 수행할 수 있습니다.
        if (defect_ReportsDTO.getReporter_name() == null || defect_ReportsDTO.getReporter_name().isEmpty()) {
            return new ResponseEntity<>("신고인 이름은 필수입니다.", HttpStatus.BAD_REQUEST);
        }
        if (defect_ReportsDTO.getPassword() == null || defect_ReportsDTO.getPassword().isEmpty()) {
            return new ResponseEntity<>("비밀번호는 필수입니다.", HttpStatus.BAD_REQUEST);
        }
        // 다른 필수 필드에 대한 검사도 추가할 수 있습니다.

        try {
            // 기존 서비스 메소드 재사용
            defactservice.insertDefect(defect_ReportsDTO);
            log.info("@# React 앱에서 결함 신고 성공적으로 접수됨.");
            return new ResponseEntity<>("결함 신고가 성공적으로 접수되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            log.error("@# React 앱 결함 신고 중 오류 발생: {}", e.getMessage());
            // 클라이언트에 상세한 에러 메시지를 전달할 수 있습니다.
            return new ResponseEntity<>("결함 신고 처리 중 서버 오류가 발생했습니다: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // ID를 받아 defect_reports 테이블에서 데이터를 조회하여 반환하는 API (기존 유지)
    @GetMapping("/selectDefectreport")
    public Defect_ReportsDTO ajaxSelectDefect(@RequestParam("id") int id) {
        log.info("@# AJAX 요청 id => " + id);
        List<Defect_ReportsDTO> defectList = defactservice.selectDefectreport(id);
        if (!defectList.isEmpty()) {
            return defectList.get(0);
        } else {
            return null;
        }
    }

    // 기존 insertDefectDetails (HTML 폼 제출용)
    @RequestMapping("/insertDefectDetails")
    public String insertDefectDetails(Defect_DetailsDTO defect_DetailsDTO) {
        log.info("@# insertDefectDetails() (Legacy HTML Form) => {}", defect_DetailsDTO);
        log.info("manufacturing_period: " + defect_DetailsDTO.getManufacturing_period());
        defactservice.insertDefectDetails(defect_DetailsDTO);
        return "redirect:main";
    }

    // ... (나머지 기존 메소드들은 그대로 유지) ...

    @RequestMapping("/defect_reports")
    public String list(Model model) {
        log.info("@#defect_reports");
        return "defect_reports";
    }

//    @RequestMapping("/defect_reports_ok")
//    public String defect_reports_ok(Model model) {
//        log.info("@#defect_reports_ok");
//        return "defect_reports_ok";
//    }

    @RequestMapping("/defect_details_check")
    public String defect_details_check(Model model) {
        log.info("@#defect_details_check");
        return "defect_details_check";
    }
    
    @GetMapping("/defect_list")
    public ResponseEntity<Map<String, Object>> getDefectList(Criteria cri) {
    	log.info("@# getDefectList() 호출: {}", cri);
    	try {
            // 1. 공지사항 목록 조회
    		ArrayList<DefectListDTO> defectList = pageService.listWithPaging(cri);
            
            // 2. 전체 공지사항 개수 조회
            int total = pageService.getTotalCount(cri);
            log.info("@# 전체 공지사항 개수: {}", total);

            // 3. PageDTO (pageMaker) 생성
            PageDTO pageMaker = new PageDTO(total, cri);

            // 4. 응답 데이터를 담을 Map 생성
            Map<String, Object> response = new HashMap<>();
            response.put("list", defectList); // 공지사항 목록
            response.put("pageMaker", pageMaker); // 페이징 정보

            // 5. ResponseEntity를 통해 JSON 데이터와 HTTP 상태 코드(OK) 반환
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            log.error("@# 공지사항 목록 조회 중 오류 발생: {}", e.getMessage());
            // 오류 발생 시 500 Internal Server Error 반환
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/defect_detail/{id}")
    public ResponseEntity<DefectListDTO> getDefectDetail(@PathVariable("id") Long id) {
        log.info("@# getDefectDetail() 호출. ID: {}", id);
        try {
        	DefectListDTO defect = defectListservice.defectView(id); // 단일 결함 DTO 조회 서비스 메소드
            if (defect != null) {
                return new ResponseEntity<>(defect, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 데이터가 없으면 404
            }
        } catch (Exception e) {
            log.error("@# 결함 상세 정보 조회 중 오류 발생: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
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