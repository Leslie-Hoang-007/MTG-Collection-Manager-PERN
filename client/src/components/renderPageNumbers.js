import React from "react";

const RenderPageNumbers = ({
    page,
    totalPages,
    handlePageChange,
}) => {
    const renderPageNumbers = () => {
        let pageNumbers = [];
        const maxVisiblePages = 7;
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

        pageNumbers.push(
            <button
                key="prev"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className="nonactive"
            >
                Previous
            </button>
        );
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage !== 1) {
            pageNumbers.push(
                <button
                    key="1"
                    className="nonactive"
                    onClick={() => handlePageChange(1)}
                >
                    1
                </button>
            );
            if (startPage > 2) {
                pageNumbers.push(<span key="elips1" className="ellipsis">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={i === page ? "active" : "nonactive"}
                >
                    {i}
                </button>
            );
        }

        if (endPage !== totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(<span key="elips2" className="ellipsis">...</span>);
            }
            pageNumbers.push(
                <button
                    key={totalPages}
                    className="nonactive"
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </button>
            );
        }

        pageNumbers.push(
            <button
                key="next"
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="nonactive"
            >
                Next
            </button>
        );

        return pageNumbers;
    };

    return (
        <div className="pagination">
            {renderPageNumbers()}
        </div>
    );
};

export default RenderPageNumbers;