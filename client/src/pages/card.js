import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';

import axios from "axios";
import { useCookies } from "react-cookie";// for cookies
import { useNavigate } from "react-router-dom";

/**
 * Card Component
 * ----------------
 * Fetches and displays detailed information about a single card.
 * Uses the `card_id` from the URL parameters to fetch data from the API.
 */
export const Card = () => {
    // Get the card_id from the URL
    const { card_id } = useParams();

    // Local state to store the card data
    const [card, setCard] = useState(null);

    useEffect(() => {
        // Make an API call to fetch card data based on the cardid
        // depending on enviroment Production or Local
        const baseURL = process.env.NODE_ENV === 'production' ? `/api/cards/${card_id}` : `http://localhost:5000/api/cards/${card_id}`;

        // Fetch card data from backend API
        axios.get(baseURL)
            .then(response => {
                // save card returned
                setCard(response.data.card[0]);
                console.log(response.data.card[0]);

            })
            .catch(error => {
                // log any errors
                console.error('Error fetching card data:', error);
            });
    }, [card_id]); // rerun effect if card_id changes

    if (!card) {
        return <div>Loading...</div>;
    }

    // Once the data is loaded, you can display it on the page
    return (
        <main className="main">
            <div className="container">
                <div className="card-page-inner-container">
                    <div className="card-image-container">
                        <img src={card["image_uris.normal"]} alt={card.name} />

                    </div>
                    <div className="card-info">
                        <div className="card-block">
                            <h1>{card.name} - {card.set_name}</h1>
                        </div>
                        <div className="card-block">
                            <h2>Set Name: <Link to={`/cards/init/${card.set_name}`}>{card.set_name}</Link></h2>
                        </div>
                        <div className="card-block">
                            <h2>Flavor</h2>
                            <p> {card.flavor_text}</p>
                        </div>
                        <div className="card-block">
                            <h2>Rules</h2>
                            <p> {card.oracle_text}</p>
                        </div>
                        <div className="card-block">
                            <h2>Rarity</h2>
                            <p>{card.rarity}</p>
                        </div>
                        <div className="card-block">
                            <h2>Card Type</h2>
                            <p>{card.type_line}</p>
                        </div>
                        <div className="card-block">
                            <h2>Price</h2>
                            <p>
                                $ {card["prices.usd"] ? parseFloat(card["prices.usd"]).toFixed(2) : 'XX.XX'}
                            </p>
                        </div>

                        <div className="card-block">
                            <h2>Mana Cost</h2>
                            <p>{card.mana_cost}</p>
                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
}