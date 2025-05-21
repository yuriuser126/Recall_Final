// src/components/DefectListSearch.js

const DefectListSearch = ({ searchCriteria, onSearchChange, onSearchSubmit }) => (
  <form onSubmit={onSearchSubmit} className="uk-form-stacked" style={{ marginBottom: '20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
      <select
        name="type"
        className="uk-select uk-form-width-small"
        value={searchCriteria.type}
        onChange={onSearchChange}
      >
        <option value="">전체</option>
        <option value="T">모델명</option>
        <option value="C">신고 유형</option>
        <option value="W">신고자</option>
      </select>

      <input
        type="text"
        name="keyword"
        className="uk-input uk-form-width-medium"
        placeholder="키워드 입력"
        value={searchCriteria.keyword}
        onChange={onSearchChange}
      />

      <span>신고일</span>
      <input
        type="date"
        name="reportDate"
        className="uk-input uk-form-width-small"
        value={searchCriteria.reportDate}
        onChange={onSearchChange}
      />

      <button type="submit" className="uk-button uk-button-primary">검색</button>
    </div>
  </form>
);

export default DefectListSearch;