<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Gemini Chat</title>
    <%-- CSS 프레임워크 (예: Bootstrap)를 사용하여 스타일링 가능 (소스 외) --%>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"> <%-- [39-41]의 Bootstrap 예시 참고 --%>
</head>
<body>
    <div class="container mt-4">
        <h2>Ask Gemini</h2>

        <%-- 질문 입력 폼 --%>
        <%-- Controller의 @PostMapping("/ask") 엔드포인트로 요청 전송 --%>
        <form action="${pageContext.request.contextPath}/chat/ask" method="post">
            <div class="form-group">
                <label for="question">Your Question:</label>
                <%-- Controller에서 Model에 담아 전달한 "question" 값을 표시 (Thymeleaf ${question}과 유사) --%>
                <input type="text" class="form-control" id="question" name="question" value="${question}" placeholder="Enter your question here">
            </div>
            <button type="submit" class="btn btn-primary">Ask</button>
        </form>

        <hr/>

        <%-- Gemini 답변 표시 영역 --%>
        <div class="card mt-4">
            <div class="card-header">
                Gemini's Answer:
            </div>
            <div class="card-body">
                <%-- Controller에서 Model에 담아 전달한 "answer" 값을 표시 --%>
                <p class="card-text">${answer}</p>
            </div>
        </div>
    </div>

    <%-- JavaScript 프레임워크 (예: Bootstrap JS) 추가 (소스 외) --%>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"></script> <%-- [39-41]의 Bootstrap 예시 참고 --%>
</body>
</html>