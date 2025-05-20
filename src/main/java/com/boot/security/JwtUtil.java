package com.boot.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;

public class JwtUtil {
	private static final String secret = "my-jwt-secret-key-which-is-long-enough"; // 32바이트 이상
	private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1시간

	private static final Key key = Keys.hmacShaKeyFor(secret.getBytes());

	public static String generateToken(String adminId) {
		return Jwts.builder()
				.setSubject(adminId)
				.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
				.signWith(key, SignatureAlgorithm.HS256)
				.compact();
	}

	public static String validateToken(String token) {
		try {
			return Jwts.parserBuilder()
					.setSigningKey(key)
					.build()
					.parseClaimsJws(token)
					.getBody()
					.getSubject();
		} catch (JwtException e) {
			return null;
		}
	}
}
