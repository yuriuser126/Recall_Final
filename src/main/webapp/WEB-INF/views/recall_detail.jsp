<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>

<head>
	<meta charset="utf-8">
	<meta content="width=device-width, initial-scale=1.0" name="viewport">
	<title>리콜 상세보기</title>
	<meta name="description" content="">
	<meta name="keywords" content="">

	<!-- Favicons -->
	<link href="${pageContext.request.contextPath}/assets/img/favicon.png" rel="icon">
	<link href="${pageContext.request.contextPath}/assets/img/apple-touch-icon.png" rel="apple-touch-icon">

	<!-- Fonts -->
	<link href="https://fonts.googleapis.com" rel="preconnect">
	<link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
	<link
		href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
		rel="stylesheet">

	<!-- Vendor CSS Files -->
	<link href="${pageContext.request.contextPath}/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/assets/vendor/aos/aos.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet">
	<link href="${pageContext.request.contextPath}/assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet">

	<!-- Main CSS File -->
	<link href="${pageContext.request.contextPath}/assets/css/main.css" rel="stylesheet">

	<!-- =======================================================
  * Template Name: Impact
  * Template URL: https://bootstrapmade.com/impact-bootstrap-business-website-template/
  * Updated: Aug 07 2024 with Bootstrap v5.3.3
  * Author: BootstrapMade.com
  * License: https://bootstrapmade.com/license/
  ======================================================== -->
	<style>
		.table-custom {
			width: 100%;
			border-collapse: collapse;
			font-size: 14px;
			text-align: center;
			background-color: #ffffff;
		}

		.table-custom th,
		.table-custom td {
			padding: 12px 15px;
			border: 1px solid color-mix(in srgb, var(--default-color), transparent 60%);
		}

		.table-custom th {
			background-color: color-mix(in srgb, var(--default-color), transparent 80%);
			font-weight: bold;
			color: #333;
		}

		.table-custom tr:nth-child(even) {
			background-color: #f9f9f9;
		}

		.table-custom tr:hover {
			background-color: #f1f1f1;
		}
	</style>
	<script src="${pageContext.request.contextPath}/js/jquery.js"></script>
	
</head>



<body class="starter-page-page">

	<header id="header" class="header fixed-top">

		<div class="topbar d-flex align-items-center">
			<div class="container d-flex justify-content-center justify-content-md-between">
				<div class="contact-info d-flex align-items-center">
					<i class="bi bi-envelope d-flex align-items-center"><a
							href="mailto:contact@example.com">contact@example.com</a></i>
					<i class="bi bi-phone d-flex align-items-center ms-4"><span>+051 1544-9970</span></i>
				</div>
				<div class="social-links d-none d-md-flex align-items-center">
					<a href="https://x.com/home" class="twitter"><i class="bi bi-twitter-x"></i></a>
					<a href="https://www.facebook.com" class="facebook"><i class="bi bi-facebook"></i></a>
					<a href="https://www.instagram.com" class="instagram"><i class="bi bi-instagram"></i></a>
					<a href="https://www.chatgpt.com" class="linkedin"><i class="bi bi-linkedin"></i></a>
				</div>
			</div>
		</div><!-- End Top Bar -->

		<div class="branding d-flex align-items-cente">

			<div class="container position-relative d-flex align-items-center justify-content-between">
				<a href="main" class="logo d-flex align-items-center">
					<!-- Uncomment the line below if you also wish to use an image logo -->
					<img src="${pageContext.request.contextPath}/assets/img/hmm.png" alt="">
					<h1 class="sitename">차량 리콜 도우미</h1>
					<span>.</span>
				</a>

				<nav id="navmenu" class="navmenu">
					<ul>
						<li><a href="recall_list">리콜 상세 정보</a></li>
						<li class="dropdown"><a href="#"><span>결함신고</span> <i
									class="bi bi-chevron-down toggle-dropdown"></i></a>
							<ul>
								<li><a href="defect_reports">결함신고</a></li>
								<li><a href="defectList">신고내역조회</a></li>
							</ul>
						</li>
						<li class="dropdown"><a href="#"><span>리콜센터</span> <i
									class="bi bi-chevron-down toggle-dropdown"></i></a>
							<ul>
								<li><a href="announce">공지사항</a></li>
								<li><a href="notice">FAQ</a></li>
							</ul>
						</li>
						<li><a href="recall_statics_year">리콜통계</a></li>
						<li class="dropdown"><a href="#"><span>관리자</span> <i
									class="bi bi-chevron-down toggle-dropdown"></i></a>
							<ul>
								<li><a href="defect_details_check">리콜정보검수</a></li>
								<li><a href="announce_write">공지사항작성</a></li>
							</ul>
						</li>

					</ul>
					<i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
				</nav>

			</div>

		</div>

	</header>

	<main class="main">

		<!-- Page Title -->
		<div class="page-title">
			<div class="heading">
				<!-- <div class="container">
						<div class="row d-flex justify-content-center text-center">
							<div class="col-lg-8">
								<h1>전국 리콜 현황</h1>
								<p class="mb-0">
									최근 국내에서 발생한 자동차 리콜 정보를 한눈에 확인할 수 있는 리콜 현황 표입니다.
									제조사별로 리콜 대상 차량의 모델명, 제조 기간, 리콜 사유 및 진행 방식 등을 상세히 안내하며, 리콜 유형(자발적/강제)과 문의 가능한 대표 연락처도
									함께 제공됩니다.
								</p>
							</div>
						</div>
					</div> -->
			</div>
			<nav class="breadcrumbs">
				<div class="container">
					<ol>
						<li><a href="main">차량리콜도우미</a></li>
						<li class="current">리콜 상세 정보</li>
					</ol>
				</div>
			</nav>
		</div><!-- End Page Title -->

		<!-- Starter Section Section -->
		<section id="starter-section" class="starter-section section">

			<!-- Section Title -->
			<div class="container section-title" data-aos="fade-up">
				<h2 class="title">리콜 상세 정보</h2>

				<div class="widgets-container">

					<!--리콜 상세 정보 출력-->

					<table class="table-custom">
						<tr>
							<th>리콜 번호</th>
							<td><b>${recall.id}</b></td>
						</tr>
						<tr>
							<th>제품명</th>
							<td>${recall.product_name}</td>
						</tr>
						<tr>
							<th>제조사</th>
							<td>${recall.manufacturer}</td>
						</tr>
						<tr>
							<th>제조기간</th>
							<td>${recall.manufacturing_period}</td>
						</tr>
						<tr>
							<th>기타정보</th>
							<td>${recall.additional_info}</td>
						</tr>
						<tr>
							<th>모델명</th>
							<td>${recall.model_name}</td>
						</tr>
						<tr>
							<th>리콜유형</th>
							<td>${recall.recall_type}</td>
						</tr>
						<tr>
							<th>연락처</th>
							<td>${recall.contact_info}</td>
						</tr>

					</table>
				</div>

				<h3 class="title">유사 리콜 추천</h3>
				<p>
					<c:forEach var="sid" items="${similarIds}">
						<p><a href="/recall_detail_${sid}">${sid}번 리콜 보기</a></p>
					</c:forEach>
				</p>

				<!-- <button class="toggle-btn btn-get-started" onclick="location.href='/recall_list'">목록으로</button> -->
				<br><a href="/recall_list">목록으로</a>

			</div><!-- End Section Title -->

		</section><!-- /Starter Section Section -->


	</main>

	<footer id="footer" class="footer accent-background">

		<div class="container footer-top">
			<div class="row gy-4">
				<div class="col-lg-5 col-md-12 footer-about">
					<a href="main" class="logo d-flex align-items-center">
						<span class="sitename">차량 리콜 도우미</span>
					</a>
					<p>우)445-871 경기도 화성시 송산면 삼존로 200 한국교통안전공단 자동차안전연구원 Tel : 080-357-2500 Fax : 031-355-0027
						본 홈페이지에 게시된 이메일 주소가 자동 수집되는 것을 거부하며, 이를 위반 시 정보통신망법에 의해 처벌됨을 유념하시기 바랍니다.</p>
					<div class="social-links d-flex mt-4">
						<a href="https://x.com/home"><i class="bi bi-twitter-x"></i></a>
						<a href="https://www.facebook.com"><i class="bi bi-facebook"></i></a>
						<a href="https://www.instagram.com"><i class="bi bi-instagram"></i></a>
						<a href="https://www.chatgpt.com"><i class="bi bi-linkedin"></i></a>
					</div>
				</div>

				<div class="col-lg-2 col-6 footer-links">
					<h4>센터 메뉴</h4>
					<ul>
						<li><a href="defect_reports">결함신고</a></li>
						<li><a href="defectList">신고내역조회</a></li>
						<li><a href="announce">공지사항</a></li>
						<li><a href="notice">FAQ</a></li>
					</ul>
				</div>

				<div class="col-lg-2 col-6 footer-links">
					<h4>리콜 센터</h4>
					<ul>
						<li><a href="recall_list">리콜정보</a></li>
						<li><a href="recall_statics_year">연도통계</a></li>
						<li><a href="recall_statics_month">달 통계</a></li>
						<li><a href="notice_write">질문하기</a></li>
					</ul>
				</div>

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
				Designed by <a href="https://www.naver.com/">team KH리콜안전공단</a>
			</div>
		</div>

	</footer>

	<!-- Scroll Top -->
	<a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center"><i
			class="bi bi-arrow-up-short"></i></a>

	<!-- Preloader -->
	<div id="preloader"></div>

	<!-- Vendor JS Files -->
	<script src="${pageContext.request.contextPath}/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
	<script src="${pageContext.request.contextPath}/assets/vendor/php-email-form/validate.js"></script>
	<script src="${pageContext.request.contextPath}/assets/vendor/aos/aos.js"></script>
	<script src="${pageContext.request.contextPath}/assets/vendor/glightbox/js/glightbox.min.js"></script>
	<script src="${pageContext.request.contextPath}/assets/vendor/swiper/swiper-bundle.min.js"></script>
	<script src="${pageContext.request.contextPath}/assets/vendor/purecounter/purecounter_vanilla.js"></script>
	<script src="${pageContext.request.contextPath}/assets/vendor/imagesloaded/imagesloaded.pkgd.min.js"></script>
	<script src="${pageContext.request.contextPath}/assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>

	<!-- Main JS File -->
	<script src="${pageContext.request.contextPath}/assets/js/main.js"></script>
	<!--

</body>

</html>