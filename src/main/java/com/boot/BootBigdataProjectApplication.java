package com.boot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.boot.dao")
public class BootBigdataProjectApplication {

	public static void main(String[] args) {
		System.out.println("서버 시작!");
		SpringApplication.run(BootBigdataProjectApplication.class, args);
	}

}
