package com.boot.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping; // POST 요청 처리를 위해 추가
import org.springframework.web.bind.annotation.RequestBody; // JSON 요청 바디를 받기 위해 추가
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; // @Controller 대신 @RestController 사용

import com.boot.dto.Criteria;
import com.boot.dto.FaqsDTO; // 기존 DTO 이름 그대로 사용
import com.boot.dto.PageDTO; // 기존 PageDTO 이름 그대로 사용
import com.boot.service.FaqannService;

import lombok.extern.slf4j.Slf4j;

@Slf4j // Lombok을 이용한 로그 설정
@RestController // 이 클래스가 RESTful API를 제공하는 컨트롤러임을 명시
@RequestMapping("/api/faqs") // React에서 요청할 API 기본 경로를 /api/notices로 설정
public class ReactFAQController {
	
	@Autowired
	private FaqannService service; // FaqannService 주입

	/**
	 * FAQ (공지사항) 목록과 페이징 정보를 JSON 형태로 반환합니다.
	 * React 애플리케이션의 FaqPage.js에서 이 API를 호출합니다.
	 *
	 * @param cri 페이징 및 검색 기준 (pageNum, amount, type, keyword)
	 * @return FAQ 리스트 (FaqsDTO)와 페이징 정보 (PageDTO)를 담은 JSON 응답
	 */
	@GetMapping // HTTP GET 요청을 처리합니다.
	public ResponseEntity<Map<String, Object>> getNoticeList(Criteria cri) {
		log.info("@# getNoticeList() 호출. 현재 검색/페이징 조건: {}", cri);
		
		try {
			// 1. 서비스 계층을 통해 FAQ 목록을 조회합니다.
			ArrayList<FaqsDTO> noticeList = service.noticelistWithPaging(cri);
			
			// 2. 서비스 계층을 통해 전체 FAQ 개수를 조회합니다.
			int total = service.noticegetTotalCount(cri);
			log.info("@# 전체 FAQ 개수: {}", total);
			
			// 3. PageDTO (페이징 정보) 생성
			PageDTO pageMaker = new PageDTO(total, cri);
			
			// 4. 응답 데이터를 담을 Map 생성
			Map<String, Object> response = new HashMap<>();
			response.put("list", noticeList); // FAQ 목록을 "list" 키로 전달
			response.put("pageMaker", pageMaker); // 페이징 정보를 "pageMaker" 키로 전달
			
			// 5. ResponseEntity를 통해 JSON 데이터와 HTTP 상태 코드(OK) 반환
			return new ResponseEntity<>(response, HttpStatus.OK);
			
		} catch (Exception e) {
			log.error("@# FAQ 목록 조회 중 오류 발생: {}", e.getMessage());
			// 오류 발생 시 500 Internal Server Error 반환
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	/**
	 * 새로운 FAQ (공지사항) 글을 작성합니다.
	 * React에서 JSON 형태로 FaqsDTO 객체를 전송받습니다.
	 *
	 * @param faqsDTO 작성할 FAQ 내용 (question, answer 등)
	 * @return 작업 성공 여부를 나타내는 응답
	 */
	@PostMapping("/write") // HTTP POST 요청을 처리하며, 글 작성 경로를 명확히 함
	public ResponseEntity<String> writeNotice(@RequestBody FaqsDTO faqsDTO) { // @RequestBody로 JSON 바디를 DTO에 매핑
		log.info("@# writeNotice() 호출. 작성할 FAQ: {}", faqsDTO);
		
		try {
			service.notice_write_ok(faqsDTO); // 서비스 계층을 통해 DB에 저장
			log.info("@# FAQ 작성 완료!");
			// 성공 시 200 OK 상태 코드와 함께 메시지 반환
			return new ResponseEntity<>("FAQ 작성이 성공적으로 완료되었습니다.", HttpStatus.OK);
		} catch (Exception e) {
			log.error("@# FAQ 작성 중 오류 발생: {}", e.getMessage());
			// 오류 발생 시 500 Internal Server Error 상태 코드와 함께 오류 메시지 반환
			return new ResponseEntity<>("FAQ 작성에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

    // 기존의 '/notice_write'는 JSP 뷰를 반환하는 메소드이므로, React에서는 필요하지 않습니다.
    // React에서는 별도의 컴포넌트(예: FaqWritePage.js)가 글 작성 폼을 렌더링하고,
    // 위 @PostMapping("/write") API를 호출하여 데이터를 전송합니다.
}