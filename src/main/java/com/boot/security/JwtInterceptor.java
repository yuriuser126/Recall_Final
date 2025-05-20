package com.boot.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

import com.boot.security.JwtUtil;

public class JwtInterceptor implements HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		String authHeader = request.getHeader("Authorization");

		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			String adminId = JwtUtil.validateToken(token);
			if (adminId != null) {
				request.setAttribute("adminId", adminId); // 필요시 컨트롤러에서 꺼내 쓸 수 있음
				return true;
			}
		}
		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		response.getWriter().write("토큰이 유효하지 않습니다.");
		return false;
	}
}
