import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";



export const Dashboard = () =>{


    // variables
    const [cookies, _] = useCookies(["access_token"]);
    const [user_id,setUser_id] = useState("");
    const [uniqueCards,setUniqueCards] = useState("");
    const [totalCards,setTotalCards] = useState("");
    const [totalValue,setTotalValue] = useState("");

    // messages

    const [message,setMessage] = useState("");

    useEffect(()=>{
        setMessage("You need to be signed in to your account to view your overall collection progress.")
        setId();
        if (user_id){
            fetchDashboard();
        }
    },[user_id]);

    const setId = () =>{
        setUser_id(cookies.access_token);
    }

    const fetchDashboard = async () =>{
        await setUser_id(cookies.access_token);
        // console.log(user_id);
        
        try {
            const response = await axios.post("http://localhost:5000/dashboard",{user_id});
            const data = response.data;
            setMessage("");
            setUniqueCards(data.uniqueCards);
            setTotalCards(data.totalCards);
            setTotalValue(data.totalValue);
        } catch (error) {
            console.error("Error fetching set names:", error);
        }
    };

    return(
        
        <div>
            {message}
            <h1>{uniqueCards}</h1>
            <h2>Unique Cards</h2>
            
            <h1>{totalCards}</h1>
            <h2>total Cards</h2>
            
            <h1>{totalValue}</h1>
            <h2>Total value</h2>
            <Link to={'/cards'}>Cards</Link>
            <br/>
            <Link to={'/collection'}>Collection</Link>
            <br/>
            <Link to={'/wishlist'}>Wishlist</Link>
        </div>
    )

};