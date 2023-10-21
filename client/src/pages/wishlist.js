import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

export const Wishlist = () => {

    // variables
    const [cards, setCards] = useState([]);

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(30);
    const [search, setSearch] = useState("");
    const [set_name, setSet_name] = useState("");
    const [sortBy, setSortBy] = useState("name-asc");
    const [totalPages, setTotalPages] = useState(1);
    const [sets, setSets] = useState([]);
    const [cookies, _] = useCookies();

    useEffect(() => {
        fetchSets();
        fetchCards();
    }, [page,search,set_name,limit,sortBy]);

    const fetchSets = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/sets`
            );
            const data = response.data;

            setSets(data.sets);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    }

    const fetchCards = async () => {
        try {
            const collection_id = cookies.wishlist_id;
            const response = await axios.post(
                `http://localhost:5000/collection`, {collection_id,page,limit,search,set_name,sortBy}
            );
            const data = response.data;
            setCards(data.cards);
            setTotalPages(Math.ceil(data.totalCards / limit));
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    }


    const fetchDeleteCard = async (cardincollection_id) => {
        try {
            console.log(cardincollection_id);
            const response = await axios.delete(`http://localhost:5000/cards`, {data:{cardincollection_id}});
            console.log(response);
            fetchCards();
        } catch (err) {
            console.log(err);
        }
    };

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

                    <Link to={`/collection/${card.cardincollection_id}`}>
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
                                    src={`https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card["multiverse_ids.0"]}&type=card`}
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
                        <p>{card.count}</p>
                        <button
                        onClick={() => fetchDeleteCard(card.cardincollection_id)}
                        >-
                        </button>
                    </div>
                </td>
            ));

            rows.push(<tr key={i}>{cardCells}</tr>);
        }

        return (
            <table>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    };


    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleSetChange = (name) => {
        setSet_name(name);
        setPage(1);
    };

    const renderPageNumbers = () => {
        let pageNumbers = [];
        const maxVisiblePages = 7;
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

        pageNumbers.push(<button
            key = "prev"
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
                pageNumbers.push(<span key ="elips1" className="ellipsis">...</span>);
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
                pageNumbers.push(<span key ="elips2" className="ellipsis">...</span>);
            }
            pageNumbers.push(
                <button key={totalPages} className="nonactive" onClick={() => handlePageChange(totalPages)} >
                    {totalPages}
                </button>
            );
        }

        pageNumbers.push(<button
            key= "next"
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
            <h1>Wishlist</h1>
            <div>
                <label>Search:</label>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div>
                <label>Set Name:</label>
                <select
                    value={set_name}
                    onChange={(e) => handleSetChange(e.target.value)}
                >
                    <option value="">All Sets</option>
                    {sets.map((setName) => (
                        <option key={setName.id} value={setName.name}>{setName.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Page Limit:</label>
                <select
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value))}
                >
                    <option value={30}>30</option>
                    <option value={60}>60</option>
                    <option value={120}>120</option>
                </select>
            </div>
            <div>
                <label>Sort By:</label>
                <select value={sortBy} onChange={(e)=> setSortBy(e.target.value)}>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="price-high">Price (High to Low)</option>
                    <option value="price-low">Price (Low to High)</option>
                </select>
            </div>
            <div>
                {cards ? renderCardTable(): null}
            </div>
            <div className="pagination">
                {renderPageNumbers()}
            </div>
        </div>
    )
};