package com.boot.dto;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnnounceDTO {
	private int id;
	private String title;
	private String content;
	private Timestamp created_at;
	
    private Long prevId; // 이전 글의 ID
    private Long nextId; // 다음 글의 ID
}











