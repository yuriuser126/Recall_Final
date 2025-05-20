// src/utils/formInputFormatters.js

/**
 * 일반 전화번호 문자열을 포맷팅합니다 (휴대폰 번호에 더 적합).
 * 숫자만 추출하여 하이픈을 포함한 형태로 반환합니다.
 * @param {string} value - 포맷팅할 전화번호 문자열
 * @returns {string} - 포맷팅된 전화번호 문자열 (하이픈 포함)
 */
export const formatPhoneNumber = (value) => {
  if (!value) return '';
  const cleaned = value.replace(/\D/g, ''); // 숫자만 남김
  const len = cleaned.length;

  if (len < 4) {
    return cleaned;
  } else if (len < 7) {
    return cleaned.slice(0, 3) + '-' + cleaned.slice(3);
  } else if (len < 11) {
    // 010-1234-5678 (11자리)
    return cleaned.slice(0, 3) + '-' + cleaned.slice(3, 7) + '-' + cleaned.slice(7);
  } else {
    // 010-1234-56789 (12자리 이상 등, 유동적으로 처리)
    return cleaned.slice(0, len - 8) + '-' + cleaned.slice(len - 8, len - 4) + '-' + cleaned.slice(len - 4);
  }
};

/**
 * 지역번호를 고려하여 유선 전화번호 문자열을 포맷팅합니다.
 * 숫자만 추출하여 하이픈을 포함한 형태로 반환합니다.
 * @param {string} value - 포맷팅할 전화번호 문자열
 * @returns {string} - 포맷팅된 전화번호 문자열 (하이픈 포함)
 */
export const formatTelephoneNumber = (value) => {
  if (!value) return '';
  let raw = value.replace(/\D/g, ''); // 숫자만 추출

  let isSeoul = raw.startsWith('02');
  let formatted = raw;

  if (isSeoul) {
    if (raw.length <= 2) {
      formatted = raw;
    } else if (raw.length <= 6) {
      formatted = raw.slice(0, 2) + '-' + raw.slice(2);
    } else if (raw.length <= 10) { // 02-xxxx-xxxx (10자리)
      formatted = raw.slice(0, 2) + '-' + raw.slice(2, 6) + '-' + raw.slice(6);
    } else { // 02-xxx-xxxx-xxxx (11자리 이상, 팩스 등)
      formatted = raw.slice(0, 2) + '-' + raw.slice(2, raw.length - 4) + '-' + raw.slice(raw.length - 4);
    }
  } else { // 0X0, 0XX (3자리 지역번호)
    if (raw.length <= 3) {
      formatted = raw;
    } else if (raw.length <= 7) {
      formatted = raw.slice(0, 3) + '-' + raw.slice(3);
    } else { // 0X0-xxxx-xxxx (11자리) 또는 0XX-xxxx-xxxx (11자리)
      formatted = raw.slice(0, 3) + '-' + raw.slice(3, 7) + '-' + raw.slice(7, 11);
    }
  }
  return formatted;
};

/**
 * 비밀번호 유효성을 검사합니다.
 * 비밀번호는 9~15자의 영문/숫자/특수문자(~, !, @, #, $, *, (, ), =, +, _, ., |) 혼용만 가능합니다.
 * @param {string} password - 검사할 비밀번호
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  const specialChars = "~!@#$*()=+_.|";
  // 정규식에서 특수문자를 올바르게 이스케이프 처리합니다.
  const escapedSpecialChars = specialChars.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');

  // 백틱(``)을 사용하여 템플릿 리터럴로 정규식을 만듭니다.
  const regex = new RegExp(
    `^(?=.*[A-Za-z])(?=.*\\d)(?=.*[${escapedSpecialChars}])[A-Za-z\\d${escapedSpecialChars}]{9,15}$`
  );

  if (password.length === 0) {
    return { isValid: false, message: "" }; // 입력 없는 초기 상태
  }

  if (!regex.test(password)) {
    return { isValid: false, message: "조건에 맞지 않는 비밀번호입니다." };
  } else {
    return { isValid: true, message: "사용 가능한 비밀번호입니다." };
  }
};