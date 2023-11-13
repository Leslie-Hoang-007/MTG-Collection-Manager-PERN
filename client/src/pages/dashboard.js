import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";



export const Dashboard = () => {


    // variables
    const [cookies, _] = useCookies();
    const [user_id, setUser_id] = useState("");
    const [uniqueCards, setUniqueCards] = useState("");
    const [totalCards, setTotalCards] = useState("");
    const [totalValue, setTotalValue] = useState("");

    // messages

    const [message, setMessage] = useState("");

    useEffect(() => {
        setMessage("You need to be signed in to your account to view your overall collection progress.")
        setId();
        if (user_id) {
            fetchDashboard();
        }
    }, [user_id]);

    const setId = () => {
        setUser_id(cookies.access_token);
    }

    const fetchDashboard = async () => {
        await setUser_id(cookies.access_token);
        // console.log(user_id);

        try {
            const baseURL = process.env.NODE_ENV === 'production' ? "/api/dashboard" : "http://localhost:5000/api/dashboard";
            const response = await axios.post(baseURL, { user_id });
            const data = response.data;
            setMessage("");
            setUniqueCards(data.uniqueCards);
            setTotalCards(data.totalCards);
            setTotalValue(data.totalValue);
            // console.log(cookies);
        } catch (error) {
            console.error("Error fetching set names:", error);
        }
    };

    return (
        <main className="main">
            <div className="container">
                {message}
                <div className="dashboard-bar">
                    <div className="dashboard-card" id="card1">
                        <h1>{uniqueCards}</h1>
                        <h2>Unique Cards</h2>
                    </div>
                    <div className="dashboard-card" id="card2">
                        <h1>{totalCards}</h1>
                        <h2>total Cards</h2>
                    </div>
                    <div className="dashboard-card" id="card3">
                        <h1>${totalValue}</h1>
                        <h2>Total value</h2>
                    </div>
                </div>
                <div className="dashboard-row">
                    <div className="dashboard-block">

                        <div>
                            <h2>
                                <img src="https://help.abbyy.com/assets/en-us/vantage/1/developer/note.svg" />
                                Quick Access
                            </h2>
                        </div>

                        <div >
                            <Link to={'/cards'} id="dashboard-list-top">Cards</Link>
                            <Link to={'/collection'}>Collection</Link>
                            <Link to={'/wishlist'} id="dashboard-list-bottom">Wishlist</Link>
                        </div>

                    </div>
                    <div className="dashboard-block">
                        <div>

                            <h2>
                                <img src={process.env.PUBLIC_URL + "/Ресурс-6@05.svg"}
                                />
                                Recent Activity
                            </h2>
                        </div>
                        <div >
                            <Link to={'/cards'} id="dashboard-list-top">Cards</Link>
                            <Link to={'/collection'}>Collection</Link>
                            <Link to={'/wishlist'} id="dashboard-list-bottom">Wishlist</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>

    )

};