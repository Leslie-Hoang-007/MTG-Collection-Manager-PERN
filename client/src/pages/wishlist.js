import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import RenderPageNumbers from "../components/renderPageNumbers";

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
    }, [page, search, set_name, limit, sortBy]);

    const fetchSets = async () => {
        try {
            const baseURL = process.env.NODE_ENV === 'production' ? `/api/sets` : `http://localhost:5000/api/sets`;
            const response = await axios.get(baseURL);
            const data = response.data;

            setSets(data.sets);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    }

    const fetchCards = async () => {
        try {
            const baseURL = process.env.NODE_ENV === 'production' ? `/api/collection` : `http://localhost:5000/api/collection`;
            const collection_id = cookies.wishlist_id;
            const response = await axios.post(
                baseURL, { collection_id, page, limit, search, set_name, sortBy }
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
            // console.log(cardincollection_id);
            const baseURL = process.env.NODE_ENV === 'production' ? `/api/cards` : `http://localhost:5000/api/cards`;
            const response = await axios.delete(baseURL, { data: { cardincollection_id } });
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

                            {card["image_uris.normal"] ? (
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
    const renderSearch = () => {
        return (
            <div className="search-container">


                <div className="search-top">

                    <div className="search-name">
                        <img className="magnifyglass" src="https://upload.wikimedia.org/wikipedia/commons/5/55/Magnifying_glass_icon.svg"></img>
                        <input
                            placeholder="Search cards..."
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="search-set">
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

                </div>

                <div className="search-display-option">
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
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="price-high">Price (High to Low)</option>
                            <option value="price-low">Price (Low to High)</option>
                        </select>
                    </div>
                </div>
            </div>

        );
    }
    return (
        <main className="main">
            <div className="container">
                <div>
                    {renderSearch()}
                </div>
                <div>
                    {cards ? renderCardTable() : null}
                </div>
                <RenderPageNumbers
                    page={page}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
            </div>
        </main>

    )
};