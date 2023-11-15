import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import HandleRefreshToken from "../components/refreshToken";



export const Dashboard = () => {


    // variables
    const [user_id, setUser_id] = useState("");
    const [uniqueCards, setUniqueCards] = useState("");
    const [totalCards, setTotalCards] = useState("");
    const [totalValue, setTotalValue] = useState("");
    const [logs, setLogs] = useState([]);
    const [cookies, _] = useCookies([])


    const signedIn = cookies.signedIn;
    // messages
    const [message, setMessage] = useState("");

    useEffect(() => {
        setMessage("You need to be signed in to your account to view your overall collection progress.")
        if (signedIn){
            fetchDashboard();
            fetchLogs();
        }
    }, [user_id]);


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
            console.log(data[0].date_time);
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
                </div>
            </div>
        </main>

    )

};