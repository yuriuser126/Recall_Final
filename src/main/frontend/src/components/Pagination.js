// components/Pagination.js
import React from 'react';

function Pagination({ pageMaker, onPageChange }) {
  const { prev, startPage, endPage, next, cri } = pageMaker; // cri는 현재 페이징 기준 (pageNum, amount, type, keyword)

  const handlePageClick = (pageNum) => {
    onPageChange({ ...cri, pageNum }); // 현재 검색 조건 유지하며 페이지 번호만 변경
  };

  return (
    <section id="blog-pagination" className="blog-pagination section">
      <div className="container">
        <div className="d-flex justify-content-center">
          <div className="div_page">
            <ul>
              {prev && (
                <li className="paginate_button">
                  <a href="#" onClick={(e) => { e.preventDefault(); handlePageClick(startPage - 1); }}>
                    <i className="bi bi-chevron-left"></i>
                  </a>
                </li>
              )}

              {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((num) => (
                <li key={num} className={`paginate_button ${cri.pageNum === num ? 'active' : ''}`}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handlePageClick(num); }}>
                    {num}
                  </a>
                </li>
              ))}

              {next && (
                <li className="paginate_button">
                  <a href="#" onClick={(e) => { e.preventDefault(); handlePageClick(endPage + 1); }}>
                    <i className="bi bi-chevron-right"></i>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pagination;