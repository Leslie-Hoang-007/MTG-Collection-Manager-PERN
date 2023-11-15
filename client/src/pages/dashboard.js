import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import HandleRefreshToken from "../components/refreshToken";
import * as XLSX from "xlsx";


export const Dashboard = () => {


    // variables
    const [user_id, setUser_id] = useState("");
    const [uniqueCards, setUniqueCards] = useState("");
    const [totalCards, setTotalCards] = useState("");
    const [totalValue, setTotalValue] = useState("");
    const [logs, setLogs] = useState([]);
    const [cookies, _] = useCookies([])
    const [cards, setCards] = useState([]);


    const signedIn = cookies.signedIn;
    // messages
    const [message, setMessage] = useState("");

    useEffect(() => {
        setMessage("You need to be signed in to your account to view your overall collection progress.")
        if (signedIn) {
            fetchDashboard();
            fetchLogs();
        }
        if (cards.length > 0) {
            handleGenerateReport();
        }
    }, [user_id, cards]);


    const fetchDashboard = async () => {
        try {
            const baseURL = process.env.NODE_ENV === 'production' ? "/api/dashboard" : "http://localhost:5000/api/dashboard";
            const response = await axios.post(baseURL, {}, { withCredentials: true });
            const data = response.data;
            setMessage("");
            setUniqueCards(data.uniqueCards);
            setTotalCards(data.totalCards);
            setTotalValue(data.totalValue);
            // console.log(cookies);
        } catch (error) {

            // If the request returns a 419, attempt to refresh the token and retry
            if (error.response && error.response.status === 419) {
                await HandleRefreshToken();
                // Retry the original request
                await fetchDashboard();
            } else {
                console.error('Error accessing dashboard data:', error);
            }
        }
    };


    const fetchLogs = async () => {
        try {
            const baseURL = process.env.NODE_ENV === 'production' ? `/api/logs` : "http://localhost:5000/api/logs";
            const response = await axios.post(baseURL, {}, { withCredentials: true });
            const data = response.data.logs.rows;
            setLogs(data);
        } catch (error) {
            if (error.response && error.response.status === 419) {
                await HandleRefreshToken();
                // Retry the original request
                await fetchLogs();
            } else {
                console.error("Error accessing logs:", error);
            }
        }
    };

    const renderLogs = () => {
        const disp_logs = []
        let x;
        if (logs.length < 4) {
            x = logs.length;
        } else { x = 4 };

        for (let i = 0; i < x; i += 1) {
            const row = (
                <div className='logdata' id={i == 0 ? "dashboard-list-top" : i == 3 ? "dashboard-list-bottom" : ""}>
                    <p>{logs[i].date_time}</p><br />
                    <p>{logs[i].log}</p>
                </div>);
            disp_logs.push(row);
        }

        return (
            <div>
                {disp_logs}
            </div>
        )
    }

    const handleGenerateReport = () => {
        // const headers = ["Count", "Name", "Set Name", "Card #", "Grade", "Foil", "My Price"];
        const headers = ["Count", "Name", "Set Name", "Card #", "My Price"];

        const wsData = [headers, ...cards.map(card => [
            card.count,
            card.name,
            card.set_name,
            card.collector_number,
            //   card.isfoil === true ? 'Wishlist' : (log.wishlist === false ? 'Collection' : 'Other'),
            card.value
        ])];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Collection");
        let fileName;
        if (cards[0].wishlist) {
            fileName = "Wishlist.xlsx";
        } else {
            fileName = "Collection.xlsx";
        }
        XLSX.writeFile(wb, fileName);
        setCards([]);
    };
    const fetchCards = async (data) => {
        const wishlist = data;
        try {
            const baseURL = process.env.NODE_ENV === 'production' ? `/api/collection` : `http://localhost:5000/api/collection`;
            const response = await axios.post(
                baseURL, { wishlist }
                , { withCredentials: true }
            );
            setCards(response.data.cards);


        } catch (error) {
            if (error.response && error.response.status === 419) {
                await HandleRefreshToken();
                // Retry the original request
                await fetchCards(wishlist);
            } else {
                console.error("Error fetching cards:", error);
            }

        }
    }




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

                        {logs.length > 0 ? renderLogs() : null}
                    </div>
                    <div className="dashboard-row">
                        <div className="dashboard-block">
                            <button onClick={() => fetchCards(false)}>Generate Collection Report</button>
                            <button onClick={() => fetchCards(true)}>Generate Wishlist Report</button>

                        </div>
                    </div>
                </div>
            </div>
        </main>

    )

};