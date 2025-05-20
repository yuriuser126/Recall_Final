// src/hooks/useForm.js
import { useState, useCallback } from 'react';

/**
 * 폼 입력 상태를 관리하는 커스텀 훅.
 * @param {object} initialValues - 폼의 초기값 객체
 * @returns {object} - { formData, handleChange, resetForm }
 */
export const useForm = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);

  // useCallback을 사용하여 handleChange 함수가 리렌더링 시 재생성되는 것을 방지
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialValues);
  }, [initialValues]); // initialValues가 변경될 때만 resetForm 재생성

  return { formData, setFormData, handleChange, resetForm };
};