package com.boot.controller;

import java.io.BufferedWriter;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boot.dto.Criteria;
import com.boot.dto.Defect_DetailsDTO;
import com.boot.service.DefectCsvService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class DefectCsvController {

    private final DefectCsvService defectCsvService;
    

    @GetMapping("/recall/download")
    public void downloadRecallCsv(Criteria cri, HttpServletResponse response) {
        try {
            int pageNum = (cri != null && cri.getPageNum() > 0) ? cri.getPageNum() : 1;
            int amount = (cri != null && cri.getAmount() > 0) ? cri.getAmount() : 10;
            log.info("downloadRecallCsv called with pageNum={}, amount={}", pageNum, amount);

            List<Defect_DetailsDTO> list = defectCsvService.getDefectsByPage(pageNum, amount);
            log.info("Defects list size: {}", list.size());

            String filename = "recall_list.csv";

            response.setContentType("text/csv; charset=UTF-8");
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");

            OutputStream os = response.getOutputStream();
            os.write(0xEF); os.write(0xBB); os.write(0xBF);

            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, StandardCharsets.UTF_8));
            writer.write("제품명,제조사,제조기간,모델명,리콜유형,연락처,추가정보\n");

            for (Defect_DetailsDTO dto : list) {
                writer.write(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                    nullSafe(dto.getProduct_name()), nullSafe(dto.getManufacturer()), nullSafe(dto.getManufacturing_period()),
                    nullSafe(dto.getModel_name()), nullSafe(dto.getRecall_type()), nullSafe(dto.getContact_info()),
                    nullSafe(dto.getAdditional_info())));
            }

            writer.flush();
            writer.close();
        } catch (Exception e) {
            log.error("CSV 다운로드 실패", e);
        }
    }

    private String nullSafe(String value) {
        return value != null ? value : "";
    }
    
    @GetMapping("/recall/fetchAndSave")
    public String fetchAndSaveData() {
        List<Defect_DetailsDTO> defectList = defectCsvService.fetchFromOpenAPI();
        defectCsvService.saveDefects(defectList);
        return "저장 완료: " + defectList.size() + "건";
    }
}