package com.boot.dao;

import org.apache.ibatis.annotations.Mapper;

import com.boot.dto.AdminDTO;

@Mapper
public interface AdminDAO {
	AdminDTO getAdminById(String id);
}
