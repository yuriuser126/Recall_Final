<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
	<title>관리자 로그인</title>
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	<style>
		body { font-family: Arial; padding: 30px; }
		form { width: 300px; margin: auto; }
		label { display: block; margin-top: 10px; }
		input[type="text"], input[type="password"] {
			width: 100%; padding: 8px; margin-top: 5px;
		}
		button { margin-top: 15px; padding: 10px 20px; }
		#error-msg { color: red; margin-top: 10px; }
	</style>
</head>
<body>

	<h2>관리자 로그인</h2>

	<form id="loginForm">
		<label for="id">아이디</label>
		<input type="text" id="id" name="id" required>

		<label for="password">비밀번호</label>
		<input type="password" id="password" name="password" required>

		<button type="submit">로그인</button>
		<div id="error-msg"></div>
	</form>

	<script>
		$("#loginForm").on("submit", function(e) {
			e.preventDefault();

			const id = $("#id").val();
			const password = $("#password").val();

			$.ajax({
				url: "/admin/login",
				method: "POST",
				data: { id: id, password: password },
				success: function(token) {
					localStorage.setItem("jwt_token", token);
					alert("로그인 성공");
					location.href = "/main"; // 로그인 후 이동할 페이지
				},
				error: function() {
					$("#error-msg").text("아이디 또는 비밀번호가 올바르지 않습니다.");
				}
			});
		});
	</script>

</body>
</html>
