# 자동차 리콜 페이지 React 프론트엔드 요구사항 정의서(초안)

## 1. 프로젝트 개요 및 목적
기존 **Spring Boot + JSP** 기반 자동차 리콜 정보 제공 웹사이트의 프론트엔드를 **React**로 마이그레이션하여,  
사용자 경험(UX) 개선 및 유지보수성 향상, **SPA(Single Page Application)** 구조 도입을 목표로 한다.

## 2. 주요 기능 목록
- **메인 페이지**: 리콜 정보 요약, 주요 공지, 통계 등
- **리콜 정보 검색 및 상세 조회**
- **결함 신고 및 신고 내역 조회/수정**
- **공지사항/FAQ/문의(Q&A) 게시판**
- **통계**: 연도별, 제조사별, 월별 등
- **사용자 인증**: 로그인/비밀번호 확인 등
- **관리자 기능**: 공지/FAQ/통계 관리 등 (필요시)

## 3. 각 기능별 상세 요구사항
- 모든 페이지는 **React Router**를 활용한 SPA로 구현
- API 연동은 기존 백엔드(Spring Boot) **REST API** 활용
- 데이터 **로딩/에러/빈 상태** 처리
- **반응형 UI**(PC/모바일 지원)
- 이미지 및 첨부파일 **업로드/다운로드** 지원(필요시)
- **접근성** 및 **웹 표준** 준수

### 예시: 리콜 정보 검색
- **검색 조건**: 제조사, 차종, 리콜명, 기간 등
- **검색 결과**: 페이징 처리, 요약 정보 표시
- **상세 페이지**: 리콜 상세 정보, 관련 이미지, 신고 버튼 등

## 4. UI/UX 요구사항
- 기존 JSP 화면과 유사한 **레이아웃 및 디자인 유지**(필요시 개선)
- 주요 화면별 **와이어프레임/프로토타입** 작성(`images` 폴더 참고)
- **공통 레이아웃**(헤더, 푸터, 네비게이션) 컴포넌트화
- **로딩 스피너, 알림(Toast)** 등 사용자 피드백 제공

## 5. 비기능 요구사항
- 코드 품질: **ESLint, Prettier** 적용
- 테스트: 기본 단위 테스트(**Jest, React Testing Library**)
- 빌드/배포: **CRA** 또는 **Vite** 기반, **Docker** 지원(필요시)
- 보안: **XSS, CSRF** 등 기본 보안 고려

## 6. 기타
- **API 명세서** 및 연동 방식 정의
- 기존 데이터 **마이그레이션/호환성** 검토
- **개발/운영 환경** 문서화


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
