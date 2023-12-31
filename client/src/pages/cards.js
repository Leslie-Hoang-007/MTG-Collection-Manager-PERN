import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DropDownMenu from "../components/dropDownMenu";

import { AnimatePresence, motion } from "framer-motion";
import Modal from "../components/modal";
import RenderPageNumbers from "../components/renderPageNumbers";
import HandleRefreshToken from "../components/refreshToken";
import { useCookies } from "react-cookie";


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

    const [modalCard, setModalCard] = useState([]);
    const [gradedUpdate, setGradedUpdate] = useState(null);
    const [cookies, setCookies] = useCookies();


    useEffect(() => {

        if (sets.length <= 1){
            fetchSets();
        }
        fetchCards();
        console.log(cookies);
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


    // GET ALL CARDS
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
            const response = await axios.post(baseURL, { card_id, value }
                , { withCredentials: true });
            console.log(response);
        } catch (error) {
            if (error.response && error.response.status === 419) {
                await HandleRefreshToken();
                // Retry the original request
                await fetchSaveCard();
            } else {
                console.error("Error adding card to collection:", error);
            }
        }
    };

    // ADD TO WISHLIST
    const fetchSaveWishlistCard = async (card_id, value) => {
        try {
            const baseURL = process.env.NODE_ENV === 'production' ? "/api/cards" : "http://localhost:5000/api/cards";
            const wishlist = true;
            const response = await axios.post(baseURL, { card_id, value, wishlist }
                , { withCredentials: true }
            );
            console.log(response);
        } catch (error) {
            if (error.response && error.response.status === 419) {
                await HandleRefreshToken();
                // Retry the original request
                await fetchSaveWishlistCard();
            } else {
                console.error("Error adding card to wishlist:", error);
            }
        }
    };

    const renderCardTable = () => {
        const cardCells = cards.map((card) => (
            <div
                key={card.id}
                // onMouseEnter={() => handleCardHover(card)}
                // onMouseLeave={handleCardLeave}
                className="card-cell"
            >

                <Link to={`/cards/${card.id}`}>
                    <div className="card-cell-image">
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
                            <img src={card["image_uris.normal"]} alt={card.name} onError={(e) => (e.target.src ='https://i.imgur.com/LdOBU1I.jpeg')}
                            />
                        ) : card.multiverse_ids && card.multiverse_ids.length > 0 ? (
                            <img
                                src={`https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=${card["multiverse_ids.0"]}&type=card`}
                                alt={card.name}
                                onError={(e) => (e.target.src ='https://i.imgur.com/LdOBU1I.jpeg')}
                            />
                        ) : (
                            <img src="https://i.imgur.com/LdOBU1I.jpeg" alt={`${card.name} - Image not available`}/>
                        )}

                    </div>
                </Link>
                <div className="card-cell-control">
                    <p>
                        $ {card["prices.usd"] ? parseFloat(card["prices.usd"]).toFixed(2) : 'XX.XX'}
                    </p>
                    {/* <button
                            onClick={() => fetchSaveCard(card.id, card["prices.usd"])}
                        >+
                        </button> */}
                    <DropdownMenu id={card.id} price={card["prices.usd"]} card={card} />
                </div>
            </div>
        ));


        return (

            <div className="card-image-grid" id ="card-image-grid-width">
                {cardCells}
            </div>

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
                <button ref={buttonRef} onClick={toggleMenu} disabled={cookies.signedIn === "" ? true : false}>
                    +
                </button>
                {isMenuOpen && (
                    <div
                        className=" dropDownMenu"
                        style={{ top: menuPosition.top + 15, left: menuPosition.left - 18 }}
                    >
                        <ul>
                            <li onClick={() => { fetchSaveCard(id, price); toggleMenu() }}>Normal</li>

                            <motion.li
                                // whileHover={{ scale: 1.1 }}
                                // whileTap={{ scale: 0.9 }}
                                className="save-button"
                                onClick={() => { { modalOpen ? close() : open(); setModalCard(card); setGradedUpdate(true); toggleMenu() } }}
                            >
                                Add Graded card
                            </motion.li>
                            <motion.li
                                // whileHover={{ scale: 1.1 }}
                                // whileTap={{ scale: 0.9 }}
                                className="save-button"
                                onClick={() => { { modalOpen ? close() : open(); setModalCard(card); setGradedUpdate(false); toggleMenu() } }}
                            >
                                With more options
                            </motion.li>
                            <li onClick={() => { fetchSaveWishlistCard(id, price); toggleMenu() }}>Wishlist</li>
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
                            onChange={(e) => {setSearch(e.target.value); setPage(1);}}
                        />
                    </div>
                    <div className="search-set">
                        <label>Set Name:</label>
                        <select
                            value={set_name}
                            onChange={(e) => {handleSetChange(e.target.value); setPage(1);}}
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


                <AnimatePresence
                    initial={false}
                    onExitComplete={() => null}
                >

                    {modalOpen && <Modal modalOpen={modalOpen} handleClose={close} card={modalCard} graded={gradedUpdate} />}
                </AnimatePresence>
                <div>
                    {renderSearch()}
                </div>

                {cards ? renderCardTable() : null}

                <RenderPageNumbers
                    page={page}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
            </div>

        </main>
    )
};