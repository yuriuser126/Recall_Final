package com.boot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; // ResponseEntity 사용을 위해 추가
import org.springframework.http.ResponseEntity; // ResponseEntity 사용을 위해 추가
import org.springframework.stereotype.Controller; // 기존 어노테이션 유지
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin; // CORS 설정을 위해 추가
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping; // POST 요청 처리를 위해 추가
import org.springframework.web.bind.annotation.RequestBody; // JSON 요청 바디를 받기 위해 추가
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.boot.dto.Defect_DetailsDTO;
import com.boot.dto.Defect_ReportsDTO; // DTO 임포트 확인
import com.boot.service.DefactService;

import lombok.extern.slf4j.Slf4j;

@Controller 
@Slf4j
@RequestMapping("/api")
@RestController
public class ReactDefectController {
	@Autowired
    private DefactService defactservice;

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
    @ResponseBody // 이 메소드가 HTTP 응답 바디에 직접 데이터를 쓸 것임을 나타냅니다 (JSON 반환)
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
    @ResponseBody
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

    @RequestMapping("/defect_list")
    public String defect_list(Model model) {
        log.info("@#defect_list");
        return "defect_list";
    }

    @RequestMapping("/defect_detail")
    public String defect_detail(Model model) {
        log.info("@#defect_detail");
        return "defect_detail";
    }
}