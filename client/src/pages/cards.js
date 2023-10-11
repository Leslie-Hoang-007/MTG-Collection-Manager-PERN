import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

export const Cards = () => {

    // variables
    const [cards, setCards] = useState([]);

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(90);
    const [search, setSearch] = useState("");
    const [set_name, setSet_name] = useState("");
    const [sortBy, setSortBy] = useState("price-high");
    const [totalPages, setTotalPages] = useState(1);


    useEffect(() => {
        fetchCards();
    }, [page]);

    const fetchCards = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/cards?page=${page}&limit=${limit}&search=${search}&set_name=${set_name}&sortBy=${sortBy}`
            );
            const data = response.data;
            setCards(data.cards);
            setTotalPages(Math.ceil(data.totalCards / limit));
            console.log(data);
            console.log('asdf',data.cards[0]["image_uris.normal"]);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    }



    const renderCardTable = () => {
        const rows = [];
        const numColumns = 6;

        for (let i = 0; i < cards.length; i += numColumns) {
            const cardRow = cards.slice(i, i + numColumns);

            const cardCells = cardRow.map((card) => (
                <td
                    key={card.id}
                // onMouseEnter={() => handleCardHover(card)}
                // onMouseLeave={handleCardLeave}

                >

                    <Link to={`/cards/${card.id}`}>
                        <div className="card">
                            {/* {hoveredCard === card && (
                                <div className="card-name-overlay">
                                    <p>
                                        {card.name}

                                        <br></br>
                                        <br></br>
                                        {card.set_name}
                                    </p>
                                </div>
                            )} */}
                            
                            { card["image_uris.normal"] ? (
                                <img src={card["image_uris.normal"]} alt={card.name} />
                            ) : card.multiverse_ids && card.multiverse_ids.length > 0 ? (
                                <img
                                    src={`https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card.multiverse_ids[0]}&type=card`}
                                    alt={card.name}
                                />
                            ) : (
                                <div className="image-not-available">Image not available</div>

                            )}

                        </div>
                    </Link>
                    <div>
                        <p>
                            {card["prices.usd"] ? parseFloat(card["prices.usd"]).toFixed(2) : 'XX.XX'}
                        </p>
                        <button
                        // onClick={() => fetchSaveCard(card.id)}
                        >+
                        </button>
                    </div>
                </td>
            ));

            rows.push(<tr key={i}>{cardCells}</tr>);
        }

        return rows;
    };


    const handlePageChange = (page) => {
        setPage(page);
    };

    const renderPageNumbers = () => {
        let pageNumbers = [];
        const maxVisiblePages = 7;
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

        pageNumbers.push(<button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="nonactive"
        >
            Previous
        </button>);
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage !== 1) {
            pageNumbers.push(
                <button key="1" className="nonactive" onClick={() => handlePageChange(1)}>
                    1
                </button>
            );
            if (startPage > 2) {
                pageNumbers.push(<span className="ellipsis">...</span>);
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
                pageNumbers.push(<span className="ellipsis">...</span>);
            }
            pageNumbers.push(
                <button key={totalPages} className="nonactive" onClick={() => handlePageChange(totalPages)} >
                    {totalPages}
                </button>
            );
        }

        pageNumbers.push(<button
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="nonactive"
        >
            Next
        </button>);

        return pageNumbers;
    };

    return (
        <div>
            <h1>hello</h1>
            <div>
                {cards ? renderCardTable(): null}
            </div>
            <div className="pagination">
                {renderPageNumbers()}
            </div>
        </div>
    )
};