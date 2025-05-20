package com.boot.controller;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boot.dto.Defect_DetailsDTO;
import com.boot.service.DefectCsvService;
import com.boot.service.PageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class DefectCsvController {

    private final DefectCsvService defectCsvService;
    private final PageService pageService;
   
    

    @GetMapping("/recall/download")
    public void downloadRecallCsv(HttpServletResponse response) {
        try {
            // 페이지나 개수 파라미터 없이 전체 데이터 조회
            List<Defect_DetailsDTO> list = defectCsvService.getAllDefects();

            String filename = URLEncoder.encode("recall_list.csv", StandardCharsets.UTF_8).replaceAll("\\+", "%20");
            response.setContentType("text/csv; charset=UTF-8");
            response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + filename);

            OutputStream os = response.getOutputStream();
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, StandardCharsets.UTF_8));

            // UTF-8 BOM 작성
            os.write(0xEF);
            os.write(0xBB);
            os.write(0xBF);

            writer.write("제품명,제조사,제조기간,모델명,리콜유형,연락처,추가정보\n");

            for (Defect_DetailsDTO dto : list) {
                writer.write(String.join(",",
                    csvEscape(dto.getProduct_name()),
                    csvEscape(dto.getManufacturer()),
                    csvEscape(dto.getManufacturing_period()),
                    csvEscape(dto.getModel_name()),
                    csvEscape(dto.getRecall_type()),
                    csvEscape(dto.getContact_info()),
                    csvEscape(dto.getAdditional_info())
                ));
                writer.write("\n");
            }

            writer.flush();
            writer.close();

        } catch (Exception e) {
            log.error("CSV 다운로드 실패", e);
            if (!response.isCommitted()) {
                try {
                    response.reset();
                    response.setContentType("text/plain; charset=UTF-8");
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.getWriter().write("CSV 파일 생성 중 오류가 발생했습니다.");
                } catch (IOException ioEx) {
                    log.error("오류 응답 전송 실패", ioEx);
                }
            }
        }
    }

    private String csvEscape(String value) {
        if (value == null) return "";
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
    
    @GetMapping("/recall/fetchAndSave")
    public String fetchAndSaveData() {
        List<Defect_DetailsDTO> defectList = defectCsvService.fetchFromOpenAPI();
        defectCsvService.saveDefects(defectList);
        return "저장 완료: " + defectList.size() + "건";
    }
}