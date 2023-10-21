import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";// for cookies
import { useNavigate } from "react-router-dom";

export const Signin = () => {
    return (
        <Login />
    );
};

const Login = () => {
    // create cookie 
    const [_, setCookies] = useCookies();

    // Variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [attempt, setAttempt] = useState(false);

    // Navigation
    const navigate = useNavigate();

    // REDIRECT TO SIGN UP
    const redirectSignup = ()=>{navigate('/account/register')};

    // fetch login
    const handleSubmit = async (event) => {// async
        event.preventDefault();// prevent refresh THEN NAVIGATE DASHBOARD

        try {
            const result = await axios.post("http://localhost:5000/login", {// fetch api
                email,
                password,
            });
            console.log(result.data.status);
            if (result.data.user_id){
                // window.localStorage.setItem("user_id", result.data.user_id);// set local sotrage to userid
                setCookies("access_token", result.data.user_id);
                setCookies("collection_id", result.data.collection_id);
                setCookies("wishlist_id", result.data.wishlist_id);
                navigate("/dashboard");// navigate to home page
            }else{
                // window.location.reload();
                setAttempt(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    let message;

    if (attempt){
        message = <h1>Invalid Credientials</h1>;
    }

    return (
        
        <div className="auth-container">
            {message}
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="email">Email address:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <button type="submit">Login</button>
                <button onClick={redirectSignup}>Sign Up</button>
                
            </form>
        </div>
    );
};