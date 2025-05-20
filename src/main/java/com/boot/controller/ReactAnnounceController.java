package com.boot.controller;

import com.boot.dto.AnnounceDTO; // 기존의 AnnounceDTO를 사용합니다.
import com.boot.dto.Criteria; // 페이징 기준 클래스 (pageNum, amount, type, keyword 포함)
import com.boot.dto.PageDTO; // 페이징 정보 클래스 (JSP의 pageMaker 역할)
import com.boot.service.FaqannService;

import lombok.extern.log4j.Log4j2; // 로그를 위한 Lombok 어노테이션
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController // RESTful API 컨트롤러임을 명시
@RequestMapping("/api/announce") // React의 프록시 설정과 매칭될 API 경로 지정
@Log4j2 // Lombok을 이용한 로그 설정
public class ReactAnnounceController {

	@Autowired
	private FaqannService service;

    /**
     * 공지사항 목록과 페이징 정보를 JSON 형태로 반환합니다.
     * React 애플리케이션에서 이 API를 호출하여 데이터를 가져갑니다.
     *
     * @param cri 페이징 및 검색 기준 (pageNum, amount, type, keyword)
     * @return 공지사항 리스트와 페이징 정보를 담은 JSON 응답
     */
    @GetMapping // GET 요청 처리
    public ResponseEntity<Map<String, Object>> getAnnounceList(Criteria cri) {
        log.info("@# getAnnounceList() 호출: {}", cri);

        try {
            // 1. 공지사항 목록 조회
            List<AnnounceDTO> announceList = service.announcelistWithPaging(cri);
            
            // 2. 전체 공지사항 개수 조회
            int total = service.announcegetTotalCount(cri);
            log.info("@# 전체 공지사항 개수: {}", total);

            // 3. PageDTO (pageMaker) 생성
            PageDTO pageMaker = new PageDTO(total, cri);

            // 4. 응답 데이터를 담을 Map 생성
            Map<String, Object> response = new HashMap<>();
            response.put("list", announceList); // 공지사항 목록
            response.put("pageMaker", pageMaker); // 페이징 정보

            // 5. ResponseEntity를 통해 JSON 데이터와 HTTP 상태 코드(OK) 반환
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            log.error("@# 공지사항 목록 조회 중 오류 발생: {}", e.getMessage());
            // 오류 발생 시 500 Internal Server Error 반환
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 예시: 상세 페이지 API (React에서 /announce_view/:id 로 라우팅될 경우)
    @GetMapping("/{id}") // PathVariable을 사용하여 ID를 받습니다.
    public ResponseEntity<AnnounceDTO> getAnnounceDetail(@PathVariable("id") Long id) {
        log.info("@# getAnnounceDetail() 호출: ID = {}", id);
        
        try {
            // 서비스 계층에서 ID를 통해 상세 공지사항 정보를 가져옵니다.
    		AnnounceDTO announce = service.announce_view(id);

            if (announce != null) {
                return new ResponseEntity<>(announce, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 해당 ID의 공지사항이 없을 경우 404
            }
        } catch (Exception e) {
            log.error("@# 공지사항 상세 조회 중 오류 발생: {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}