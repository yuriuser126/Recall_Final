package com.boot.service;

import javax.annotation.PostConstruct; // 초기화 메서드 사용을 위해 필요 (소스 외)

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;


@Service
public class GeminiServiceImpl implements GeminiService {
	
	@Value("${google.gemini.api.key}")
    private String apiKey;

    private Client geminiClient;
    
    
    // 빈 초기화 시 클라이언트를 생성합니다 (소스 외 패턴)
    @PostConstruct
    public void init() {
        // google-genai 클라이언트 생성 [7]
        // API 키를 명시적으로 설정하여 Gemini Developer 백엔드 사용
        this.geminiClient = Client.builder().apiKey(apiKey).build();
    }
    
    /**
     * Gemini 모델에게 질문하고 답변을 받습니다.
     * @param question 사용자 질문
     * @return Gemini의 답변 텍스트
     */
	@Override
	public String askGemini(String question) {
		if (geminiClient == null) {
            // 클라이언트가 초기화되지 않았다면 에러 또는 기본 응답 반환 (에러 처리 로직 추가 필요 [45, 46])
            return "Gemini service is not initialized."; // 예시 메시지
        }

        try {
            // generateContent 메서드를 사용하여 텍스트 콘텐츠 생성 [5]
            // "gemini-2.0-flash-001" 모델 사용 예시 [5, 8-12]
            GenerateContentResponse response = geminiClient.models.generateContent(
                    "gemini-2.0-flash-001",
                    question,
                    null // 추가 설정 (GenerateContentConfig)는 null로 설정 [5, 11]
            );

            // 응답에서 텍스트 부분 추출 [5]
            return response.text();

        } catch (Exception e) {
            // API 호출 중 에러 발생 시 처리 (로깅 및 에러 응답 반환 등 필요 [45, 46])
            e.printStackTrace(); // 에러 로깅 예시 [46]
            return "Error communicating with Gemini: " + e.getMessage(); // 예시 에러 메시지
        }
	}
    // 애플리케이션 종료 시 클라이언트 리소스 해제를 위한 메서드 (선택 사항, 소스 외)
    // @PreDestroy
    // public void cleanup() {
    //     if (geminiClient != null) {
    //         geminiClient.close(); // 클라이언트 close 메서드 제공 시 호출
    //     }
    // }
	
	
};