<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page import="com.fasterxml.jackson.databind.ObjectMapper" %>


<html>

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title>summaryList</title>
  <script src="${pageContext.request.contextPath}/js/jquery.js"></script>
  <style>
  .year-form {
    background-color: #f9f9f9;
    padding: 20px;
    margin: 30px auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: fit-content;
    text-align: center;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.05);
  }

  .year-form .inline-group {
    display: inline-block;
    margin: 0 10px;
  }

  .year-form label {
    font-weight: bold;
    margin-right: 5px;
  }

  .year-form select {
    padding: 5px 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    min-width: 100px;
    font-size: 14px;
  }

  .year-form input[type="submit"] {
    margin-left: 20px;
    padding: 6px 14px;
  }

  .table-summary {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      text-align: center;
      background-color: #ffffff;
    }

    .table-summary th, .table-summary td {
      padding: 12px 15px;
      border: 1px solid color-mix(in srgb, var(--default-color), transparent 60%);
    }

    .table-summary th {
      background-color: color-mix(in srgb, var(--default-color), transparent 80%);
      font-weight: bold;
      color: #333;
    }

    .table-summary tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    .table-summary tr:hover {
      background-color: #f1f1f1;
    }
    
    .btn-get-started {
      color: color-mix(in srgb, var(--default-color), transparent 40%);
      background: var(--accent-color);
      font-family: var(--heading-font);
      font-weight: 500;
      font-size: 14px;
      letter-spacing: 1px;
      display: inline-block;
      padding: 14px 40px;
      border-radius: 50px;
      transition: 0.3s;
      border: 2px solid color-mix(in srgb, var(--default-color), transparent 90%);
      background-color: color-mix(in srgb, var(--default-color), transparent 90%);
    }

    .btn-get-started:hover {
      border-color: color-mix(in srgb, var(--default-color), transparent 60%);
    }
  </style>
</head>

<body class="starter-page-page">
	<main class="main">
	<h1>연도별 리콜 통계 신고 현황<h1>
	<h2>결함 신고 요약 통계</h2>
		<table class="table-summary">
	      <thead>
	          <tr>
	              <th rowspan="2">해당 연도</th>
	              <th colspan="2">국산자동차</th>
	              <th colspan="2">수입자동차</th>
	              <th colspan="2">계</th>
	          </tr>
	          <tr>
	              <th>차종</th>
	              <th>대수</th>
	              <th>차종</th>
	              <th>대수</th>
	              <th>차종</th>
	              <th>대수</th>
	          </tr>
	      </thead>
	      <tbody>
	          <tr>
				<td>${summary.label}</td>
				<td>${summary.domesticModelCount}</td>
				<td>${summary.domesticCount}</td>
				<td>${summary.domesticModelCount}</td>
				<td>${summary.importedCount}</td>
				<td>${summary.totalModelCount}</td>
				<td>${summary.totalCount}</td>
	          </tr>
	      </tbody>
		</table>
  
	<h2>연도별 리콜현황</h2>
		<table class="table-summary">
		    <thead>
			  <tr>
	              <th rowspan="2">해당 연도</th>
	              <th colspan="2">국산자동차</th>
	              <th colspan="2">수입자동차</th>
	              <th colspan="2">계</th>
	          </tr>
		      <tr>
		        <th>국산 차종</th>
		        <th>국산 대수</th>
		        <th>수입 차종</th>
		        <th>수입 대수</th>
		        <th>전체 차종</th>
		        <th>전체 대수</th>
		      </tr>
		    </thead>
		    <tbody>
				<c:forEach var="item" items="${summaryList}">
				    <tr>
				        <td>${item.report_year}</td>
				        <td>${item.domesticModelCount}</td>
				        <td>${item.domesticCount}</td>
				        <td>${item.importedModelCount}</td>
				        <td>${item.importedCount}</td>
				        <td>${item.totalModelCount}</td>
				        <td>${item.totalCount}</td>
				    </tr>
				</c:forEach>
		    </tbody>
		</table>

		<%-- Gemini 답변 표시 영역 --%>
        <div class="card mt-4">
            <div class="card-header">
                <h2>Gemini's summarize</h2>
            </div>
            <div class="card-body">
                <%-- Controller에서 Model에 담아 전달한 "answer" 값을 표시 --%>
                <p class="card-text">${answer}</p>
            </div>
        </div>		  
				  
  </main>

  <footer id="footer" class="footer accent-background">


          <div class="col-lg-3 col-md-12 footer-contact text-center text-md-start">
            <h4>Contact Us</h4>
            <p>부산광역시 부산진구 중앙대로 672 2</p>
            <p>삼비빌딩</p>
            <p>2F, 12F</p>
            <p class="mt-4"><strong>Phone:</strong> <span>010-1234-5678</span></p>
            <p><strong>Email:</strong> <span>contact@example.com</span></p>
          </div>
        </div>
      </div>

      <div class="container copyright text-center mt-4">
        <p>© <span>KH 정보교육원</span> <strong class="px-1 sitename">KH리콜안전공단</strong> <span>자동차안전연구원 </span></p>
        <div class="credits">
          <!-- All the links in the footer should remain intact. -->
          <!-- You can delete the links only if you've purchased the pro version. -->
          <!-- Licensing information: https://bootstrapmade.com/license/ -->
          <!-- Purchase the pro version with working PHP/AJAX contact form: [buy-url] -->
          Designed by team KH리콜안전공단
        </div>
      </div>

    </footer>

  
</body>

</html>