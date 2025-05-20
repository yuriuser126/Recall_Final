package com.boot.controller;

import com.boot.dto.AdminDTO;
import com.boot.security.JwtUtil;
import com.boot.service.AdminService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@Slf4j
@RequiredArgsConstructor
public class AdminController {

	private final AdminService adminService;

	@GetMapping("/admin/login")
	public String loginPage() {	
		log.info("@# /admin/login");
		return "admin/login";
	}

	@PostMapping("/admin/login")
	@ResponseBody
	public ResponseEntity<?> login(@RequestParam String id, @RequestParam String password) {

		log.info("입력 ID: {}", id);
		log.info("입력 PW: {}", password);
		AdminDTO admin = adminService.getAdminById(id);
		log.info("DB Admin: {}", admin);

		if (admin != null && admin.getPassword().equals(password)) {
			String token = JwtUtil.generateToken(id);
			return ResponseEntity.ok().body(token);
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패");
	}
	
	@GetMapping("/admin/test")
	public String adminTestPage() {
		log.info("@# /admin/test");	
		return "admin/test";
	}
	
	@GetMapping("/admin/secret")
	@ResponseBody
	public String secret(@RequestAttribute("adminId") String adminId) {
		return "Hello 관리자 " + adminId + ", 이 페이지는 보호된 페이지입니다.";
	}

}
