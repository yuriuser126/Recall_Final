package com.boot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor

public class RecallCountDTO {
	
	private String model_name;
	private int count;
}
