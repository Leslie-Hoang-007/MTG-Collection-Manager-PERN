import React, { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';

import axios from "axios";
import { useCookies } from "react-cookie";// for cookies
import { useNavigate } from "react-router-dom";


export const Card = () => {
    const { card_id } = useParams();
    const [card, setCard] = useState(null);

    useEffect(() => {
        // Make an API call to fetch card data based on the cardid
        const baseURL = process.env.NODE_ENV === 'production' ? `cards/${card_id}` : `http://localhost:5000/cards/${card_id}`;
        axios.get(baseURL)
            .then(response => {
                setCard(response.data.card[0]);
                console.log(response.data.card[0]);
            
            })
            .catch(error => {
                console.error('Error fetching card data:', error);
            });
    }, [card_id]);

    if (!card) {
        return <div>Loading...</div>;
    }

    // Once the data is loaded, you can display it on the page
    return (
        <div>
            <h1>{card.name} - {card.set_name}</h1>
            <img src={card["image_uris.normal"]} alt={card.name} />
            <p>Product Details<br/> {card.oracle_text}</p>
            <p>Set Name: <Link to={`/cards/init/${card.set_name}`}>{card.set_name}</Link></p>
            <p>Rarity:<br/> {card.rarity}</p>
            <p>Card Type:<br/> {card.type_line}</p>
            <p>Price:<br/> {card["prices.usd"]}</p>
        </div>
    );
}