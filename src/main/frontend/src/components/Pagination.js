// components/Pagination.js

const Pagination = ({ pageMaker, onPageChange }) => {
  const { prev, startPage, endPage, next, cri } = pageMaker;

  const handlePageClick = (pageNum) => {
    onPageChange({ ...cri, pageNum });
  };

  return (
    <section id="blog-pagination" className="blog-pagination section">
      <div className="container">
        <div className="d-flex justify-content-center">
          <div className="div_page">
            <ul>
              {prev && (
                <li className="paginate_button">
                  <button type="button" onClick={() => handlePageClick(startPage - 1)} className="link-button">
                    <i className="bi bi-chevron-left">이전</i>
                  </button>
                </li>
              )}
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((num) => (
                <li key={num} className={`paginate_button${cri.pageNum === num ? ' active' : ''}`}>
                  <button type="button" onClick={() => handlePageClick(num)} className="link-button">
                    {num}
                  </button>
                </li>
              ))}
              {next && (
                <li className="paginate_button">
                  <button type="button" onClick={() => handlePageClick(endPage + 1)} className="link-button">
                    <i className="bi bi-chevron-right">다음</i>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pagination;