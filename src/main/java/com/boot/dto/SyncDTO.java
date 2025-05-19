package com.boot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SyncDTO {
	
	private int inserted;
	private int updated;
	private int skipped;
	
	@Override
	public String toString() {
		return "SyncResultDTO [inserted=" + inserted + ", updated=" + updated + ", skipped=" + skipped + "]";
	}
}
