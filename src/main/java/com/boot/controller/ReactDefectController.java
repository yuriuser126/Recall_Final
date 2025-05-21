package com.boot.controller;

import java.io.IOException;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping; // POST 요청 처리를 위해 추가
import org.springframework.web.bind.annotation.PutMapping;
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
import com.boot.service.RecallService;
import com.boot.service.RecallServiceImpl.XmlParserUtil;

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
	
	@Autowired
    private RecallService recallService;
	
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
    @GetMapping("/selectDefectreport{id}")
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

    /**
     * React용 결함 상세 정보 저장/수정 (검수 완료)
     * POST /api/insertDefectDetails
     * @param defect_DetailsDTO JSON body로 전달
     * @return 저장 결과(성공/실패)
     */
    @PostMapping("/insertDefectDetails")
    public ResponseEntity<?> insertDefectDetailsReact(@RequestBody Defect_DetailsDTO defect_DetailsDTO) {
        log.info("[React] insertDefectDetails() 호출");
        log.info("[React] defect_DetailsDTO => {}", defect_DetailsDTO);
        log.info("[React] manufacturing_period: {}", defect_DetailsDTO.getManufacturing_period());
        try {
            defactservice.insertDefectDetails(defect_DetailsDTO);
            return ResponseEntity.ok().body("success");
        } catch (Exception e) {
            log.error("[React] insertDefectDetails 오류", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("fail");
        }
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

  	//비밀번호 체크
    @PostMapping("/defect_pwcheck") // POST 요청을 받습니다.
    public ResponseEntity<Boolean> checkPassword(@RequestBody Map<String, String> param){
        log.info("@# checkPassword() 호출");
        String password = param.get("password"); // 요청 바디에서 password 추출
        // log.info("@# 입력 비밀번호: " + password); // 보안상 실제 비밀번호는 로그에 남기지 않는 것이 좋습니다.
        Long id = Long.parseLong(param.get("id")); // 요청 바디에서 id 추출 및 Long으로 변환
        int intid = Integer.parseInt(param.get("id")); // 요청 바디에서 id 추출 및 Long으로 변환
        log.info("@# 요청 ID: " + id);

        try {
            // 서비스 계층을 통해 DB에서 해당 ID의 DTO를 가져옵니다.
        	DefectListDTO dto = defectListservice.getById(intid);

            // 비밀번호 비교 로직:
            // 실제 프로젝트에서는 dto.getPassword()가 해싱된 비밀번호여야 합니다.
            // 그리고 password.equals(dto.getPassword()) 대신 BCryptPasswordEncoder.matches() 등을 사용해야 합니다.
            // 여기서는 제공해주신 JSP 로직과 최대한 유사하게 일단 String 비교로 두었습니다.
            // ***주의: 이 부분은 보안상 매우 취약하므로 실제 서비스에서는 반드시 해싱된 비밀번호 비교로 변경해야 합니다.***
            if (dto != null && password.equals(dto.getPassword())) {
                return new ResponseEntity<>(true, HttpStatus.OK); // 비밀번호 일치 시 true 반환 (HTTP 200 OK)
            } else {
                return new ResponseEntity<>(false, HttpStatus.OK); // 비밀번호 불일치 시 false 반환 (HTTP 200 OK)
            }
        } catch (Exception e) {
            log.error("@# 비밀번호 확인 중 오류 발생: {}", e.getMessage(), e);
            // 오류 발생 시 500 Internal Server Error와 함께 false 반환
            return new ResponseEntity<>(false, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
  	
    // 신고 내역 수정 API
    @PutMapping("/defect_modify") // PUT 요청을 받습니다. (RESTful API 관례)
    public ResponseEntity<String> updateDefect(@RequestBody DefectListDTO DefectListDTO) {
        log.info("@# updateDefect() 호출. DTO: {}", DefectListDTO);
        try {
            // 서비스 계층에서 수정 로직 수행
        	defectListservice.modify(DefectListDTO); // modify 메소드 호출
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            log.error("@# 결함 내역 수정 중 오류 발생: {}", e.getMessage(), e);
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
  	
 // 신고 내역 삭제 API
    @DeleteMapping("/defect_delete/{id}") // DELETE 요청을 받습니다.
    public ResponseEntity<String> deleteDefect(@PathVariable("id") Long id) {
        log.info("@# deleteDefect() 호출. ID: {}", id);
        try {
            // 서비스 계층에서 삭제 로직 수행
        	defectListservice.delete(id); // remove 메소드 호출
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } catch (Exception e) {
            log.error("@# 결함 내역 삭제 중 오류 발생: {}", e.getMessage(), e);
            return new ResponseEntity<>("FAIL", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
 // 리콜 목록 조회 API
    @GetMapping("/recall_list")
    public ResponseEntity<Map<String, Object>> getRecallList(Criteria cri) {
        log.info("@# getRecallList() 호출. 현재 검색/페이징 조건: {}", cri);
        try {
            List<Defect_DetailsDTO> recallList = recallService.getAllRecallByCri(cri); // 서비스에서 목록 조회
            int total = recallService.getRecallTotalCount(cri); // 서비스에서 전체 개수 조회
            log.info("@# 전체 리콜 개수: {}", total);

            PageDTO pageMaker = new PageDTO(total, cri); // PageDTO 생성

            Map<String, Object> response = new HashMap<>();
            response.put("list", recallList);
            response.put("pageMaker", pageMaker);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.error("@# 리콜 목록 조회 중 오류 발생: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/recall_detail/{id}")
    public ResponseEntity<?> getRecallDetail(@PathVariable("id") Long id) {
        log.info("@# getRecallDetail 호출. 리콜 ID: {}", id);
        try {
            Defect_DetailsDTO recall = recallService.getRecallById(id);

            if (recall == null) {
                log.warn("@# 리콜 ID {}에 대한 정보가 없습니다.", id);
                return new ResponseEntity<>("리콜 정보를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }

            // 유사 리콜 ID 가져오기
            List<Integer> similarIds = recallService.getSimilarRecallIds(id);

            // React 컴포넌트가 예상하는 형식으로 데이터 구성
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("recall", recall);
            responseData.put("similarIds", similarIds);

            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            log.error("@# 리콜 상세 정보 조회 중 오류 발생 (ID: {}): {}", id, e.getMessage(), e);
            return new ResponseEntity<>("리콜 상세 정보를 불러오는 데 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // CSV 전체 다운로드 API
    @GetMapping("/recall/downloadCsv")
    public ResponseEntity<byte[]> downloadRecallCsv() {
        try {
            byte[] csvBytes = recallService.generateCsvReport(); // 서비스에서 CSV 데이터 생성
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"recall_list.csv\"")
                    .contentType(org.springframework.http.MediaType.parseMediaType("text/csv"))
                    .body(csvBytes);
        } catch (IOException e) {
            log.error("@# CSV 파일 생성 또는 다운로드 중 오류 발생: {}", e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    // 엑셀 전체 다운로드 API
//    @GetMapping("/recall/downloadExcel")
//    public ResponseEntity<byte[]> downloadRecallExcel() {
//        try {
//            byte[] excelBytes = recallService.generateExcelReport(); // 서비스에서 엑셀 데이터 생성
//            return ResponseEntity.ok()
//                    .header("Content-Disposition", "attachment; filename=\"recall_list.xlsx\"")
//                    .contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
//                    .body(excelBytes);
//        } catch (IOException e) {
//            log.error("@# 엑셀 파일 생성 또는 다운로드 중 오류 발생: {}", e.getMessage(), e);
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
    
//	API -> DB 저장 메서드 (100건 테스트용)
	@ResponseBody
	@GetMapping("/recall/save")
	public String saveToDb() throws Exception {
		String cntntsId = "0301";
		Criteria cri = new Criteria(1, 100); // 1페이지, 100건
		String xml = recallService.fetchXmlFromApi(cri, cntntsId);
		List<Defect_DetailsDTO> list = XmlParserUtil.parseToList(xml);
		recallService.saveApiDataToDB(list);
		return "DB 저장 완료 (" + list.size() + "건)";
	}
	
	//	API -> DB 저장 메서드 (전체)
	@ResponseBody
	@GetMapping("/recall/saveAll")
	public String saveAllToDb() throws Exception {
		String cntntsId = "0301";
		int perPage = 100;

		// 1페이지 먼저 요청 → 전체 건수(totalCount) 파악
		Criteria cri = new Criteria(1, perPage);
		String firstXml = recallService.fetchXmlFromApi(cri, cntntsId);
		int total = XmlParserUtil.getTotalCount(firstXml);
		int totalPages = (int) Math.ceil((double) total / perPage);

		int savedCount = 0;

		for (int page = 1; page <= totalPages; page++) {
			Criteria pageCri = new Criteria(page, perPage);
			String xml = recallService.fetchXmlFromApi(pageCri, cntntsId);
			List<Defect_DetailsDTO> list = XmlParserUtil.parseToList(xml);
			recallService.saveApiDataToDB(list);
			savedCount += list.size();
			
			log.info(">>> " + page + "페이지 처리 완료 (" + list.size() + "건)");
		}
		
		System.out.println("totalCount: " + total);
		return "전체 저장 완료! 총 " + savedCount + "건 저장됨.";
	}
}