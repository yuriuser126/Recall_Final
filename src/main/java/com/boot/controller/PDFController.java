package com.boot.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired; // @Autowired 어노테이션 사용 [21, 24, 27, 28, 30]
import org.springframework.stereotype.Controller; // @Controller 어노테이션 사용 [18-20]
import org.springframework.ui.Model; // Model 객체 사용 (뷰에 데이터 전달) [24, 34]
import org.springframework.web.bind.annotation.GetMapping; // @GetMapping 어노테이션 사용 [22, 24]
import org.springframework.web.bind.annotation.PostMapping; // @PostMapping 어노테이션 사용 [22, 24]
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // @RequestParam 어노테이션 사용 [24]
import org.springframework.web.bind.annotation.ResponseBody;

import com.boot.dto.DefectReportSummaryDTO;
import com.boot.dto.ManufacturerRecallDTO;
import com.boot.service.GeminiService;
import com.boot.service.PdfGenerationService;
import com.boot.service.RecallService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class PDFController {
    
    @Autowired
    private PdfGenerationService pdfGenerationService;

	@Autowired
    private RecallService recallService;
	
	@Autowired
    private GeminiService geminiService; // 인터페이스 타입으로 주입
	
    @PostMapping("/generatePdfFromHtml")
    public void generatePdfFromHtml(@RequestParam("htmlContent") String htmlContent, HttpServletResponse response) throws IOException, InterruptedException {
    	log.info("generatePdfFromHtml");
    	log.info("htmlContent"+htmlContent);
        File pdfFile = pdfGenerationService.generatePdfFromHtml(htmlContent, "generated_from_html.pdf");
        sendFileToClient(pdfFile, response, "generated_from_html.pdf");
    }

    @GetMapping("/generatePdfFromUrl")
    public void generatePdfFromUrl(@RequestParam("url") String url, HttpServletResponse response) throws IOException, InterruptedException {
    	log.info("generatePdfFromUrl");
        File pdfFile = pdfGenerationService.generatePdfFromUrl(url, "generated_from_url.pdf");
        sendFileToClient(pdfFile, response, "generated_from_url.pdf");
    }

    private void sendFileToClient(File file, HttpServletResponse response, String fileName) throws IOException {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
        response.setContentLength((int) file.length());

        try (InputStream inputStream = new FileInputStream(file);
             java.io.OutputStream outputStream = response.getOutputStream()) {
            byte[] buffer = new byte[8192]; // 버퍼 크기 설정 (적절한 크기로 조정 가능)
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            outputStream.flush();
        } finally {
            if (file.exists()) {
                file.delete(); // 임시 파일 삭제
            }
        }
    }
    
    @RequestMapping("/pdf/recall_statics_summaryList")
    public String recall_statics_pdf(
            @RequestParam(required = false) Integer startYear,
            @RequestParam(required = false) Integer endYear,
            Model model) {

        Map<String, Object> paramMap = new HashMap<>();
        if (startYear == null || startYear == 0) {
            startYear = 2000;
        }
        if (endYear == null || endYear == 0) {
            endYear = 2025;
        }
        paramMap.put("start_year", startYear);
        paramMap.put("end_year", endYear);
        
        //리콜현황
        DefectReportSummaryDTO summary = recallService.getDefectReportSummary(paramMap);
        model.addAttribute("summary", summary);
        List<DefectReportSummaryDTO> summaryList  = recallService.getDefectReportSummaryByYear(paramMap);
        model.addAttribute("summaryList", summaryList);

        String predefinedQuestion = "이 자료들은 연도별 리콜현황에 관한 자료인데, domesticmodelcount는 국산 차종, importedmodelcount는 수입 차종이야. <br><br> 국산과 수입에 의거한 리콜 위험 점수 내용,<br> 주요 리콜 국산과 수입에 의거한 현황 내용,<br> 자동차 리콜의 중요성을 작성해줘. 각 항목은 <p> 태그로 감싸서 출력해줘.```html``` 로는 감쌀 필요 없어" // 미리 지정할 질문
         + summaryList;
        // Gemini API를 호출하여 predefinedQuestion에 대한 답변 얻기
        String geminiAnswer = geminiService.askGemini(predefinedQuestion); 
        model.addAttribute("answer", geminiAnswer);
    
		return "pdf/recall_statics_summaryList";
	}
    
    @RequestMapping("/pdf/recall_statics_manafacturer")
    public String recall_statics_manafacturer(
    		@RequestParam(required = false) Integer startYear,
    		@RequestParam(required = false) Integer endYear,
    		Model model) {
    	
    	Map<String, Object> paramMap = new HashMap<>();
    	if (startYear == null || startYear == 0) {
    		startYear = 2000;
    	}
    	if (endYear == null || endYear == 0) {
    		endYear = 2025;
    	}
    	paramMap.put("start_year", startYear);
    	paramMap.put("end_year", endYear);
    	
        List<ManufacturerRecallDTO> stats = recallService.getYearlyRecallStats(startYear, endYear);
        model.addAttribute("recallStats", stats);
    	
        Map<String, List<ManufacturerRecallDTO>> grouped = stats.stream()
        	    .collect(Collectors.groupingBy(ManufacturerRecallDTO::getCar_manufacturer));

        	model.addAttribute("groupedRecallStats", grouped);
    	
    	
    	String predefinedQuestion = "이 자료들은 연도별 리콜현황 제조사별에 관한 자료인데, car_manufacturer는 제조사야. <br><br> 제조사별 리콜 위험 점수 내용,<br> 제조사별 주요 리콜 현황 내용,<br> 자동차 리콜의 중요성을 작성해줘. 각 항목은 <p> 태그로 감싸서 출력해줘.```html``` 로는 감쌀 필요 없어" // 미리 지정할 질문
    			+ grouped;
    	
    	String geminiAnswer = geminiService.askGemini(predefinedQuestion);
    	model.addAttribute("answer", geminiAnswer);
    	
    	return "pdf/recall_statics_manafacturer";
    }
	
}
