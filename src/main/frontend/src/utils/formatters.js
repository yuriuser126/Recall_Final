// src/utils/formatters.js

/**
 * ISO 8601 형식의 날짜/시간 문자열을 "YY-MM-DD 오전/오후 HH:MM" 형식으로 포맷합니다.
 * 예: "2025-05-07T00:57:31.000+00:00" -> "25-05-07 오전12:57"
 * @param {string} isoString - ISO 8601 형식의 날짜/시간 문자열
 * @returns {string} 포맷된 날짜/시간 문자열 또는 빈 문자열
 */
export const formatDateTime = (isoString) => {
  if (!isoString) {
    return '';
  }

  const date = new Date(isoString);

  // Date 객체가 유효하지 않은 경우 빈 문자열 반환
  if (isNaN(date.getTime())) {
    console.error("Invalid date string provided to formatDateTime:", isoString);
    return '';
  }

  const formatter = new Intl.DateTimeFormat('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    // timeZone: 'Asia/Seoul', // 필요하다면 시간대 지정 (서버가 UTC면 클라이언트 시간에 맞춤)
  });

  const formattedDate = formatter.format(date);

  // 최종 원하는 형식으로 가공
  return formattedDate
    .replace(/\.\s/g, '-') // ". "를 "-"로 변경 (예: 25. 05. 07. -> 25-05-07)
    .replace(/\.$/, '')   // 마지막 마침표 제거 (예: 25-05-07.)
    .replace('오전 ', '오전') // '오전 ' -> '오전'
    .replace('오후 ', '오후'); // '오후 ' -> '오후'
};