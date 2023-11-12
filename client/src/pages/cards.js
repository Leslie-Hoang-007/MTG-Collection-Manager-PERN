import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import DropDownMenu from "../components/dropDownMenu";

import { AnimatePresence, motion } from "framer-motion";
import Modal from "../components/modal";
import RenderPageNumbers from "../components/renderPageNumbers";

export const Cards = () => {

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

    const [modalCard, setModalCard] = useState([]);

    const user_id = cookies.access_token;

    useEffect(() => {


        // Format the date using the Intl.DateTimeFormat
        const formattedDate = dateTimeFormat.format(date);

        console.log(formattedDate);
        fetchSets();
        fetchCards();
    }, [page, search, set_name, limit, sortBy]);



    const fetchSets = async () => {
        try {
            const baseURL = process.env.NODE_ENV === 'production' ? `/api/sets` : `http://localhost:5000/api/sets`;

            const response = await axios.get(
                baseURL
            );
            const data = response.data;

            setSets(data.sets);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    }

    // const for later converting time 
    // Assuming you have received the timestamp from the API response
    const timestamp = "2023-10-20 19:56:46-04";

    // Convert the timestamp to a JavaScript Date object
    const date = new Date(timestamp);

    // Create an Intl.DateTimeFormat instance to format the date
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });


    // GET CARDS
    const fetchCards = async () => {
        try {
            const baseURL = process.env.NODE_ENV === 'production' ? `/api/cards?page=${page}&limit=${limit}&search=${search}&set_name=${set_name}&sortBy=${sortBy}` : `http://localhost:5000/api/cards?page=${page}&limit=${limit}&search=${search}&set_name=${set_name}&sortBy=${sortBy}`;
            const response = await axios.get(
                baseURL
            );
            const data = response.data;
            setCards(data.cards);
            setTotalPages(Math.ceil(data.totalCards / limit));
            // console.log(data);
            // console.log('asdf',data.cards[0]["image_uris.normal"]);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
    }

    // ADD TO COLLECTION
    const fetchSaveCard = async (card_id, value) => {
        try {
            // console.log(user_id);
            const baseURL = process.env.NODE_ENV === 'production' ? "/api/cards" : "http://localhost:5000/api/cards";
            const collection_id = cookies.collection_id;
            const response = await axios.post(baseURL, { user_id, collection_id, card_id, value });
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    };

    // ADD TO WISHLIST
    const fetchSaveWishlistCard = async (card_id, value) => {
        try {
            const baseURL = process.env.NODE_ENV === 'production' ? "/api/cards" : "http://localhost:5000/api/cards";
            const collection_id = cookies.wishlist_id;
            const response = await axios.post(baseURL, { user_id, collection_id, card_id, value });
            console.log(response);
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
                        {/* <button
                            onClick={() => fetchSaveCard(card.id, card["prices.usd"])}
                        >+
                        </button> */}
                        <DropdownMenu id={card.id} price={card["prices.usd"]} card={card} />
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


    const DropdownMenu = ({ id, price, card }) => {
        const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
        const buttonRef = useRef(null);
        const [isMenuOpen, setIsMenuOpen] = useState(false);

        const toggleMenu = () => {
            if (buttonRef.current) {
                const buttonRect = buttonRef.current.getBoundingClientRect();
                const newPosition = {
                    top: buttonRect.bottom + window.pageYOffset,
                    left: buttonRect.left + window.pageXOffset,
                };
                setMenuPosition(newPosition);
            }
            setIsMenuOpen(!isMenuOpen);
        };
        
        return (
            <div>
                <button ref={buttonRef} onClick={toggleMenu}>
                    +
                </button>
                {isMenuOpen && (
                    <div
                        className=" dropDownMenu"
                        style={{ top: menuPosition.top + 15, left: menuPosition.left - 18 }}
                    >
                        <ul>
                            <li onClick={() => fetchSaveCard(id, price)}>Normal</li>
                            <motion.li
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="save-button"
                                onClick={() => (modalOpen ? close() : open(), setModalCard(card))}
                            >
                                Add Graded card
                            </motion.li>
                            <motion.li
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="save-button"
                                onClick={() => (modalOpen ? close() : open(), setModalCard(card))}
                            >
                                With more options
                            </motion.li>
                            <li onClick={() => fetchSaveWishlistCard(id, price)}>Wishlist</li>
                        </ul>
                    </div>
                )}

            </div>


        );
    }
    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleSetChange = (name) => {
        setSet_name(name);
        setPage(1);
    };

    const [modalOpen, setModalOpen] = useState(false);
    const close = () => setModalOpen(false);

    const open = () => {
        setModalOpen(true);
    };
    return (
        <div>
            <h1>hello</h1>

            <AnimatePresence
                initial={false}
                onExitComplete={() => null}
            >

                {modalOpen && <Modal modalOpen={modalOpen} handleClose={close} card={modalCard} />}
            </AnimatePresence>
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
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="price-high">Price (High to Low)</option>
                    <option value="price-low">Price (Low to High)</option>
                </select>
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
    )
};