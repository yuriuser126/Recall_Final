<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head><title>리콜 상세보기</title></head>
<body>
	<h2>리콜 상세 정보</h2>

	<table border="1">
		<tr><th>제품명</th><td>${recall.product_name}</td></tr>
		<tr><th>제조사</th><td>${recall.manufacturer}</td></tr>
		<tr><th>제조기간</th><td>${recall.manufacturing_period}</td></tr>
		<tr><th>기타정보</th><td>${recall.additional_info}</td></tr>
		<tr><th>모델명</th><td>${recall.model_name}</td></tr>
		<tr><th>리콜유형</th><td>${recall.recall_type}</td></tr>
		<tr><th>연락처</th><td>${recall.contact_info}</td></tr>
	</table>

	<h3>유사 리콜 추천</h3>
	<ul>
		<c:forEach var="sid" items="${similarIds}">
			<li><a href="/recall/details/${sid}">${sid}번 리콜 보기</a></li>
		</c:forEach>
	</ul>

	<br><a href="/recall_list">← 목록으로</a>
</body>
</html>
