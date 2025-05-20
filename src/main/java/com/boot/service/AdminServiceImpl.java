package com.boot.service;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.dao.AdminDAO;
import com.boot.dto.AdminDTO;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AdminServiceImpl implements AdminService {

	@Autowired
	private SqlSession sqlSession;

	@Override
	public AdminDTO getAdminById(String id) {
		AdminDAO dao = sqlSession.getMapper(AdminDAO.class);
		return dao.getAdminById(id);
	}
}
