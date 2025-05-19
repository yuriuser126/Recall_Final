package com.boot.controller;

import org.springframework.beans.factory.annotation.Autowired; // @Autowired 어노테이션 사용 [21, 24, 27, 28, 30]
import org.springframework.stereotype.Controller; // @Controller 어노테이션 사용 [18-20]
import org.springframework.ui.Model; // Model 객체 사용 (뷰에 데이터 전달) [24, 34]
import org.springframework.web.bind.annotation.GetMapping; // @GetMapping 어노테이션 사용 [22, 24]
import org.springframework.web.bind.annotation.PostMapping; // @PostMapping 어노테이션 사용 [22, 24]
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // @RequestParam 어노테이션 사용 [24]

import com.boot.service.GeminiService;

@Controller
@RequestMapping("/chat")
public class GeminiController {
	@Autowired
    private GeminiService geminiService; // 인터페이스 타입으로 주입

	// GET 요청 처리: 채팅 페이지를 보여줍니다.
    // @GetMapping("/chat") 또는 @RequestMapping(value="/chat", method=RequestMethod.GET) [20, 22, 24]
    @GetMapping
    public String showChatPage(Model model) {
        // 초기 페이지 로딩 시 빈 질문과 답변을 모델에 추가
        model.addAttribute("question", "");
        model.addAttribute("answer", "Please ask a question.");
        return "chat"; // "chat.jsp" 또는 "chat.html" 등의 뷰 이름 반환 [24, 34, 35]
    }

    // POST 요청 처리: 사용자 질문을 받아 Gemini에게 전달하고 답변을 받아옵니다.
    // @PostMapping("/ask") 또는 @RequestMapping(value="/ask", method=RequestMethod.POST) [20, 22, 24]
    @PostMapping("/ask")
    public String askGemini(@RequestParam("question") String question, Model model) {
        // @RequestParam을 사용하여 요청 파라미터에서 질문 문자열을 가져옵니다 [24]

        // Service 계층의 메서드를 호출하여 비즈니스 로직 실행 (Gemini에게 질문) [17, 30, 31]
        String answer = geminiService.askGemini(question);

        // 질문과 답변을 Model 객체에 담아 뷰에 전달합니다 [24, 34]
        model.addAttribute("question", question);
        model.addAttribute("answer", answer);

        return "chat"; // 결과를 보여줄 뷰 이름 반환 (예: chat.jsp) [24, 34, 35]
    }
	
}
