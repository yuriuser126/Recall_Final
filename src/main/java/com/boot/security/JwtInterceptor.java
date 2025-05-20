package com.boot.security;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;

public class JwtInterceptor implements HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		String token = null;

		// 쿠키에서 jwt_token 찾기
		if (request.getCookies() != null) {
			for (Cookie cookie : request.getCookies()) {
				if (cookie.getName().equals("jwt_token")) {
					token = cookie.getValue();
					break;
				}
			}
		}

		// 토큰 검증
		if (token != null) {
			String adminId = JwtUtil.validateToken(token);
			if (adminId != null) {
				request.setAttribute("adminId", adminId); // 컨트롤러에서 사용 가능
				return true;
			}
		}

		// 실패 시 에러 응답
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		response.setContentType("text/plain;charset=UTF-8");
		response.getWriter().write("토큰이 유효하지 않습니다.");
		return false;
	}
}
