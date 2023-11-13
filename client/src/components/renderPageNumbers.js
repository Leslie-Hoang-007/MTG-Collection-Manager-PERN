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
            <li className="nonactive" id={page ===1 ? "disable": ""}>
                <a
                    key="prev"
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </a>
            </li>
        );
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage !== 1) {
            pageNumbers.push(
                <li className="nonactive">
                    <a
                        key="1"
                        onClick={() => handlePageChange(1)}
                    >
                        1
                    </a>
                </li>

            );
            if (startPage > 2) {
                pageNumbers.push(<li key="elips1" className="ellipsis">...</li>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li className={i === page ? "active" : "nonactive"}
                >
                    <a
                        key={i}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </a>

                </li>
            );
        }

        if (endPage !== totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(<li key="elips2" className="ellipsis">...</li>);
            }
            pageNumbers.push(
                <li className="nonactive"
                >
                    <a
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </a>

                </li>
            );
        }

        pageNumbers.push(
            <li className="nonactive" id={page ===totalPages ? "disable": ""}>
                <a
                    key="next"
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </a>
            </li>
        );

        return pageNumbers;
    };

    return (
        <div className="pagination">
            <ul>
            {renderPageNumbers()}

            </ul>
        </div>
    );
};

export default RenderPageNumbers;