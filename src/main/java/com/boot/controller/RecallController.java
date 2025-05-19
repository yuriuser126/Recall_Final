package com.boot.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.boot.dto.Criteria;
import com.boot.dto.DefectReportSummaryDTO;
import com.boot.dto.Defect_DetailsDTO;
import com.boot.dto.ManufacturerRecallDTO;
import com.boot.dto.PageDTO;
import com.boot.dto.SyncDTO;
import com.boot.service.RecallService;
import com.boot.service.RecallServiceImpl.XmlParserUtil;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class RecallController {
	@Autowired
    private RecallService recallService;
	
//	@RequestMapping("/recall_statics")
//	public String recall_statics(Model model) {
//		return "recall_statics";
//	}
	
	@RequestMapping("/recall_statics_year")
	public String recall_statics_year( 
			@RequestParam(required = false) Integer startYear,
		    @RequestParam(required = false) Integer endYear,
		    Model model) {
		
		log.info("@#recall_statics_year");
		Map<String, Object> paramMap = new HashMap<>();
		if (startYear == null || startYear == 0) {
			startYear=2000;
		}
		if (endYear == null || endYear == 0) {
			endYear=2025;
		}
		paramMap.put("start_year", startYear);
        paramMap.put("end_year", endYear);
        
        //리콜현황
        DefectReportSummaryDTO summary = recallService.getDefectReportSummary(paramMap);
        model.addAttribute("summary", summary);
        List<DefectReportSummaryDTO> summaryList  = recallService.getDefectReportSummaryByYear(paramMap);
        model.addAttribute("summaryList", summaryList);
        List<ManufacturerRecallDTO> stats = recallService.getYearlyRecallStats(startYear, endYear);
        model.addAttribute("recallStats", stats);
        
        Map<String, List<ManufacturerRecallDTO>> grouped = stats.stream()
        	    .collect(Collectors.groupingBy(ManufacturerRecallDTO::getCar_manufacturer));

        	model.addAttribute("groupedRecallStats", grouped);
		//결함신고
        
		return "recall_statics_year";
	}
	
	@GetMapping("/recall_statics_month")
    public String recall_statics_month(
        @RequestParam(required = false) Integer startYear,
        @RequestParam(required = false) Integer endYear,
        @RequestParam(required = false) Integer startMonth,
        @RequestParam(required = false) Integer endMonth,
        Model model) {
		
		log.info("recall_statics_month");
        Map<String, Object> params = new HashMap<>();
        params.put("start_year", startYear);
        params.put("start_month", startMonth);
        params.put("end_year", endYear);
        params.put("end_month", endMonth);

        List<DefectReportSummaryDTO> monthsummaryList = recallService.getDefectReportSummaryByMonth(params);
//        log.info("monthsummaryList"+monthsummaryList);
        model.addAttribute("monthsummaryList", monthsummaryList);
//        log.info("monthsummaryList: {}", monthsummaryList);
        List<ManufacturerRecallDTO> stats = recallService.getYearlyRecallStatsByMonth(params);
        model.addAttribute("recallStats", stats);
        Map<String, List<ManufacturerRecallDTO>> grouped = stats.stream()
        	    .collect(Collectors.groupingBy(ManufacturerRecallDTO::getCar_manufacturer));

        	model.addAttribute("groupedRecallStats", grouped);
        
        return "recall_statics_month"; 
    }
	
	@RequestMapping("/recall_list")
	public String recall_list(Criteria cri, Model model) throws Exception {
	    String cntntsId = "0301"; 
	    List<Defect_DetailsDTO> list = recallService.getProductList(cri, cntntsId);
	    //923개의 리콜이 xml 92개로 나눠져 있어서 일단 하드코딩했다
//	    int total = recallService.getTotalCount(cri, cntntsId);
	    int total = 923;

	    model.addAttribute("recall_list", list);
	    model.addAttribute("pageMaker", new PageDTO(total, cri));
	    
	    log.info("@#"+cri);
	    log.info("@#list : "+list);
	    log.info("@#total : "+total);
	    log.info("@# : "+new PageDTO(total, cri));
	    
		return "recall_list";
	}
	
	//	API -> DB 저장 메서드 (100건 테스트용)
	@ResponseBody
	@GetMapping("/recall/save")
	public String saveToDb() throws Exception {
		String cntntsId = "0301";
		Criteria cri = new Criteria(1, 100); // 1페이지, 100건
		String xml = recallService.fetchXmlFromApi(cri, cntntsId);
		List<Defect_DetailsDTO> list = XmlParserUtil.parseToList(xml);
		recallService.saveApiDataToDB(list);
		return "DB 저장 완료 (" + list.size() + "건)";
	}
	
	//	API -> DB 저장 메서드 (전체)
	@ResponseBody
	@GetMapping("/recall/saveAll")
	public String saveAllToDb() throws Exception {
		String cntntsId = "0301";
		int perPage = 100;

		// 1페이지 먼저 요청 → 전체 건수(totalCount) 파악
		Criteria cri = new Criteria(1, perPage);
		String firstXml = recallService.fetchXmlFromApi(cri, cntntsId);
		int total = XmlParserUtil.getTotalCount(firstXml);
		int totalPages = (int) Math.ceil((double) total / perPage);

		int savedCount = 0;

		for (int page = 1; page <= totalPages; page++) {
			Criteria pageCri = new Criteria(page, perPage);
			String xml = recallService.fetchXmlFromApi(pageCri, cntntsId);
			List<Defect_DetailsDTO> list = XmlParserUtil.parseToList(xml);
			recallService.saveApiDataToDB(list);
			savedCount += list.size();
			
			log.info(">>> " + page + "페이지 처리 완료 (" + list.size() + "건)");
		}
		
		System.out.println("totalCount: " + total);
		return "전체 저장 완료! 총 " + savedCount + "건 저장됨.";
	}

//	API 동기화 메서드 (100건 테스트용)
	@GetMapping("/recall/sync")
	@ResponseBody
	public String syncData() throws Exception {
		String xml = recallService.fetchXmlFromApi(new Criteria(1, 100), "0301");
		List<Defect_DetailsDTO> list = XmlParserUtil.parseToList(xml);
		SyncDTO result = recallService.syncApiDataWithDB(list);
		return "동기화 완료! " + result.toString();
	}
	
//	API 동기화 메서드 (전체)
	@GetMapping("/recall/syncAll")
	@ResponseBody
	public String syncAllToDb() throws Exception {
		String cntntsId = "0301";
		int perPage = 100;

		// 먼저 1페이지 호출해서 전체 개수 파악
		Criteria cri = new Criteria(1, perPage);
		String firstXml = recallService.fetchXmlFromApi(cri, cntntsId);
		int total = XmlParserUtil.getTotalCount(firstXml);
		int totalPages = (int) Math.ceil((double) total / perPage);

		int inserted = 0, updated = 0, skipped = 0;

		for (int page = 1; page <= totalPages; page++) {
			Criteria pageCri = new Criteria(page, perPage);
			String xml = recallService.fetchXmlFromApi(pageCri, cntntsId);
			List<Defect_DetailsDTO> list = XmlParserUtil.parseToList(xml);

			SyncDTO result = recallService.syncApiDataWithDB(list);

			inserted += result.getInserted();
			updated += result.getUpdated();
			skipped += result.getSkipped();

			System.out.println(page + "페이지 완료: [insert " + result.getInserted()
					+ ", update " + result.getUpdated() + ", skip " + result.getSkipped() + "]");
		}

		return "전체 동기화 완료! 총 insert: " + inserted + ", update: " + updated + ", skip: " + skipped;
	}

}
