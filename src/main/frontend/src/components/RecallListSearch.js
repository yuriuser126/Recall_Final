// src/components/RecallListSearch.js
import React, { useState, useEffect } from 'react';

function RecallListSearch({ searchCriteria, onSearchSubmit, onSearchChange }) {
    const [searchType, setSearchType] = useState(searchCriteria.type || '');
    const [searchKeyword, setSearchKeyword] = useState(searchCriteria.keyword || '');

    // searchCriteria prop이 변경될 때 내부 상태도 업데이트 (URL 파라미터 변경 등에 대응)
    useEffect(() => {
        setSearchType(searchCriteria.type || '');
        setSearchKeyword(searchCriteria.keyword || '');
    }, [searchCriteria]);

    // 검색 타입 변경 핸들러
    const handleTypeChange = (e) => {
        setSearchType(e.target.value);
        onSearchChange({ ...searchCriteria, type: e.target.value });
    };

    // 검색 키워드 변경 핸들러
    const handleKeywordChange = (e) => {
        setSearchKeyword(e.target.value);
        onSearchChange({ ...searchCriteria, keyword: e.target.value });
    };

    // 검색 버튼 클릭 또는 Enter 키 입력 시
    const handleSubmit = (e) => {
        e.preventDefault(); // 폼 기본 제출 동작 방지
        // 검색 실행 시 페이지 번호를 1로 초기화하여 새로운 검색을 시작
        onSearchSubmit({ ...searchCriteria, type: searchType, keyword: searchKeyword, pageNum: 1 });
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
                value={searchType}
                onChange={handleTypeChange}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
                <option value="">검색 유형 선택</option>
                <option value="product_name">제품명</option>
                <option value="manufacturer">제조사</option>
                <option value="model_name">모델명</option>
                <option value="recall_type">리콜유형</option>
                {/* 필요에 따라 다른 검색 유형 추가 */}
            </select>
            <input
                type="text"
                value={searchKeyword}
                onChange={handleKeywordChange}
                placeholder="검색어를 입력하세요"
                style={{ flexGrow: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button
                type="submit"
                style={{
                    padding: '8px 15px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                검색
            </button>
        </form>
    );
}

export default RecallListSearch;