package com.boot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Defect_DetailsDTO {
	private int id; 
	private String product_name; 
	private String manufacturer; 
	private String manufacturing_period; 
	private String model_name; 
	private String recall_type; 
	private String contact_info; 
	private String additional_info;
	private String hash_code;
	
	public String generateHashCode() {
		String raw = safe(product_name) +
					 safe(manufacturer) +
					 safe(manufacturing_period) +
					 safe(model_name) +
					 safe(recall_type) +
					 safe(contact_info) +
					 safe(additional_info);
		return org.apache.commons.codec.digest.DigestUtils.sha256Hex(raw);
	}

	private String safe(String str) {
		return str == null ? "" : str.trim();
	}

}
