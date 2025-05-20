package com.boot.service;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import com.boot.dao.RecallStaticDAO;
import com.boot.dto.Criteria;
import com.boot.dto.DefectReportSummaryDTO;
import com.boot.dto.Defect_DetailsDTO;
import com.boot.dto.ManufacturerRecallDTO;
import com.boot.dto.SyncDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("RecallService")
public class RecallServiceImpl implements RecallService{
	
	private final String serviceKey = "PLMG96N58S";
	
	@Autowired
	private SqlSession sqlSession;
	
	@Override
	public List<Defect_DetailsDTO> getProductList(Criteria cri, String cntntsId) throws Exception {
		String xml = fetchXmlFromApi(cri, cntntsId);
        return XmlParserUtil.parseToList(xml);
	}

	@Override
	public int getTotalCount(Criteria cri, String cntntsId) throws Exception {
		String xml = fetchXmlFromApi(cri, cntntsId);
        return XmlParserUtil.getTotalCount(xml);
	}
	
	@Override
	public String fetchXmlFromApi(Criteria cri, String cntntsId) throws Exception {
        String apiUrl = "https://www.consumer.go.kr/openapi/recall/contents/index.do"
                + "?serviceKey=" + serviceKey
                + "&pageNo=" + cri.getPageNum()
                + "&cntPerPage=" + cri.getAmount()
                + "&cntntsId=" + cntntsId;

        StringBuilder result = new StringBuilder();
        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-Type", "application/xml; charset=UTF-8");

        BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        String line;
        while ((line = rd.readLine()) != null) {
            result.append(line);
        }
        rd.close();
        conn.disconnect();

        return result.toString();
    }
	
	public class XmlParserUtil {

	    // XML을 파싱해서 Defect_DetailsDTO 객체 리스트로 변환
	    public static List<Defect_DetailsDTO> parseToList(String xml) throws Exception {
	        List<Defect_DetailsDTO> defectList = new ArrayList<>();
	        
	        // XML 문서 파서 생성
	        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
	        DocumentBuilder builder = factory.newDocumentBuilder();
	        
	        // XML 스트링을 Document 객체로 파싱
	        Document doc = builder.parse(new InputSource(new StringReader(xml)));
	        
	        // <content> 태그를 찾기
	        NodeList nodeList = doc.getElementsByTagName("content");

	        for (int i = 0; i < nodeList.getLength(); i++) {
	            Element element = (Element) nodeList.item(i);

	            // 각 content에 대해 필요한 정보를 가져와서 Defect_DetailsDTO에 담기
	            Defect_DetailsDTO defectDetails = new Defect_DetailsDTO();
	            defectDetails.setProduct_name(getTagValue("productNm", element));
	            defectDetails.setManufacturer(getTagValue("makr", element));
	            defectDetails.setManufacturing_period(getTagValue("mnfcturPd", element));
	            defectDetails.setModel_name(getTagValue("modlNmInfo", element));
	            defectDetails.setRecall_type(getTagValue("recallSe", element));
	            defectDetails.setContact_info(getTagValue("recallEntrpsInfo", element));
//	            defectDetails.setAdditional_info(getTagValue("etcInfo", element));
	            defectDetails.setAdditional_info(stripHtmlTags(getTagValue("etcInfo", element)));

	            defectList.add(defectDetails);
	        }

	        return defectList;
	    }

	    // 모든 <태그> 제거
	    private static String stripHtmlTags(String input) {
	    	if (input == null) return "";
	    	return input.replaceAll("<[^>]*>", "").trim();
	    }
	    
	    // 특정 태그의 값을 추출하는 helper method
	    private static String getTagValue(String tag, Element element) {
	        NodeList list = element.getElementsByTagName(tag);
	        return list.getLength() > 0 ? list.item(0).getTextContent() : "";
	    }
	    
	    public static int getTotalCount(String xml) throws Exception {
	        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
	        DocumentBuilder builder = factory.newDocumentBuilder();
	        
	        // XML 스트링을 Document 객체로 파싱
	        Document doc = builder.parse(new InputSource(new StringReader(xml)));
	        
	        // <totalCount> 태그 값 가져오기
	        NodeList nodeList = doc.getElementsByTagName("allCnt");
	        if (nodeList.getLength() > 0) {
	            return Integer.parseInt(nodeList.item(0).getTextContent());
	        }
	        return 0;
	    }
	}

	@Override
    public DefectReportSummaryDTO getDefectReportSummary(Map<String, Object> paramMap) {
		RecallStaticDAO dao = sqlSession.getMapper(RecallStaticDAO.class);
        return dao.getdefect_reports_count(paramMap);
    }
	
	@Override
	public List<DefectReportSummaryDTO> getDefectReportSummaryByYear(Map<String, Object> paramMap) {
		RecallStaticDAO dao = sqlSession.getMapper(RecallStaticDAO.class);
	    return dao.getDefectReportSummaryByYear(paramMap);
	}

	@Override
    public List<ManufacturerRecallDTO> getYearlyRecallStats(int startYear, int endYear) {
		RecallStaticDAO dao = sqlSession.getMapper(RecallStaticDAO.class);
        return dao.getYearlyRecallStats(startYear, endYear);
    }

	@Override
	public List<DefectReportSummaryDTO> getDefectReportSummaryByMonth(Map<String, Object> paramMap) {
		log.info("paramMap =>"+paramMap);
		RecallStaticDAO dao = sqlSession.getMapper(RecallStaticDAO.class);
		return dao.getDefectReportSummaryByMonth(paramMap);
	}

	@Override
	public List<ManufacturerRecallDTO> getYearlyRecallStatsByMonth(Map<String, Object> paramMap) {
		log.info("paramMap =>"+paramMap);
		RecallStaticDAO dao = sqlSession.getMapper(RecallStaticDAO.class);
		return dao.getYearlyRecallStatsByMonth(paramMap);
	}
	
//	public Map<String, Object> getdefect_reports_count(Integer startYear, Integer endYear,Map<String, Object> params){
////	public int getdefect_reports_count(Integer startYear, Integer endYear) {
//		RecallStaticDAO dao = sqlSession.getMapper(RecallStaticDAO.class);
////		RecallStaticDAO dao = sqlSession.getMapper(RecallStaticDAO);
//	    params.put("start_year", startYear);
//	    params.put("end_year", endYear);
//	    return dao.getdefect_reports_count(params);
//	}
	
	
	// API -> DB 저장
	@Override
	public void saveApiDataToDB(List<Defect_DetailsDTO> apiList) {
		RecallStaticDAO dao = sqlSession.getMapper(RecallStaticDAO.class);

		for (Defect_DetailsDTO dto : apiList) {
			if (dao.checkDuplicate(dto) == 0) {
				dao.insertDefect(dto);
			}
		}
	}
	
	// API -> DB 동기화
	@Override
	public SyncDTO syncApiDataWithDB(List<Defect_DetailsDTO> apiList) {
		RecallStaticDAO dao = sqlSession.getMapper(RecallStaticDAO.class);
		SyncDTO result = new SyncDTO();
		int inserted = 0, updated = 0, skipped = 0;

		for (Defect_DetailsDTO dto : apiList) {
			dto.setHash_code(dto.generateHashCode());

			Defect_DetailsDTO dbData = dao.findByKey(dto);

			if (dbData == null) {
				dao.insertDefect(dto);
				inserted++;
			} else if (!dto.getHash_code().equals(dbData.getHash_code())) {
				dao.updateDefect(dto);
				updated++;
			} else {
				skipped++;
			}
		}

		result.setInserted(inserted);
		result.setUpdated(updated);
		result.setSkipped(skipped);
		return result;
	}

	
	@Override
	public List<Integer> getSimilarRecallIds(int targetId) {
		String apiUrl = "http://localhost:5000/recommend?id=" + targetId;

		RestTemplate restTemplate = new RestTemplate();

		ResponseEntity<Integer[]> response = restTemplate.getForEntity(apiUrl, Integer[].class);
		Integer[] ids = response.getBody();

		return Arrays.asList(ids);
	}
	
	@Override
	public List<Defect_DetailsDTO> getAllRecalls() {
		RecallStaticDAO dao = sqlSession.getMapper(RecallStaticDAO.class);
		return dao.getAllRecalls();
	}
	
	@Override
	public Defect_DetailsDTO getRecallById(Long id) {
		RecallStaticDAO dao = sqlSession.getMapper(RecallStaticDAO.class);
		return dao.findById(id);
	}

	@Override
	public List<Defect_DetailsDTO> getAllRecallByCri(Criteria cri) {
		RecallStaticDAO dao = sqlSession.getMapper(RecallStaticDAO.class);
		return dao.getListWithPaging(cri);
	}

	@Override
	public int getRecallTotalCount(Criteria cri) {
		RecallStaticDAO dao = sqlSession.getMapper(RecallStaticDAO.class);
		return dao.getTotalCount(cri);
	}
	@Override
	public byte[] generateCsvReport() throws IOException {
        // 이 getAllRecalls() 메소드는 실제 매퍼나 리포지토리에서 모든 데이터를 가져오는 메소드여야 합니다.
        // 예: recallMapper.getAllRecalls();
		RecallStaticDAO dao = sqlSession.getMapper(RecallStaticDAO.class);
        List<Defect_DetailsDTO> list = getAllRecalls(); // 전체 데이터 불러오기

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        // UTF-8 BOM을 추가하여 MS Excel에서 한글 깨짐 현상을 방지
        baos.write(new byte[] { (byte) 0xEF, (byte) 0xBB, (byte) 0xBF });
        OutputStreamWriter writer = new OutputStreamWriter(baos, StandardCharsets.UTF_8);

        // CSV 헤더 작성
        writer.write("id,manufacturer,model_name,recall_type,additional_info\n");

        // 데이터 작성
        for (Defect_DetailsDTO dto : list) {
            writer.write(dto.getId() + "," +
                         clean(dto.getManufacturer()) + "," +
                         clean(dto.getModel_name()) + "," +
                         clean(dto.getRecall_type()) + "," +
                         clean(dto.getAdditional_info()) + "\n");
        }

        writer.flush(); // 버퍼 비우기
        writer.close(); // writer 닫기 (baos는 자동으로 닫히지 않음)

        return baos.toByteArray(); // 바이트 배열 반환
    }

    /**
     * CSV에 쓸 때 콤마나 개행 문자를 제거하고 따옴표로 감싸는 유틸리티 메소드.
     * 이는 CSV 파싱 오류를 방지하기 위함입니다.
     */
    private String clean(String text) {
        if (text == null) return "";
        // 콤마(,), 큰따옴표("), 개행 문자(\r, \n) 등을 처리
        String cleanedText = text.replaceAll("\"", "\"\""); // 큰따옴표는 두 개로 이스케이프
        // 필드 내에 콤마나 개행이 포함되어 있다면 큰따옴표로 감쌈
        if (cleanedText.contains(",") || cleanedText.contains("\n") || cleanedText.contains("\r") || cleanedText.contains("\"")) {
            return "\"" + cleanedText + "\"";
        }
        return cleanedText.trim();
    }

	@Override
	public byte[] generateExcelReport() {
		// TODO Auto-generated method stub
		return null;
	}	
	
}
