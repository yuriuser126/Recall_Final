package com.boot.controller;

import java.net.URLEncoder;
import java.util.List;

import javax.servlet.http.HttpServletResponse;


import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boot.dto.Defect_DetailsDTO;
import com.boot.service.DefectCsvService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class DefectExcelController {

    private final DefectCsvService defectCsvService;

    @GetMapping("/recall/downloadExcel")
    public void downloadExcel(HttpServletResponse response) {
        try {
            List<Defect_DetailsDTO> dataList = defectCsvService.getAllDefects();

            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("리콜 정보");

            // 헤더
            Row header = sheet.createRow(0);
            String[] headers = {"제품명", "제조사", "제조기간", "모델명", "리콜유형", "연락처", "추가정보"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // 데이터
            for (int i = 0; i < dataList.size(); i++) {
                Defect_DetailsDTO dto = dataList.get(i);
                Row row = sheet.createRow(i + 1);
                row.createCell(0).setCellValue(dto.getProduct_name());
                row.createCell(1).setCellValue(dto.getManufacturer());
                row.createCell(2).setCellValue(dto.getManufacturing_period());
                row.createCell(3).setCellValue(dto.getModel_name());
                row.createCell(4).setCellValue(dto.getRecall_type());
                row.createCell(5).setCellValue(dto.getContact_info());
                row.createCell(6).setCellValue(dto.getAdditional_info());
            }

            // 셀 너비 자동 조정
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // 파일 이름 인코딩
            String fileName = URLEncoder.encode("recall_list.xlsx", "UTF-8").replaceAll("\\+", "%20");

            // 응답 헤더 설정
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + fileName);

            workbook.write(response.getOutputStream());
            workbook.close();
        } catch (Exception e) {
            log.error("엑셀 다운로드 실패", e);
        }
    }
}