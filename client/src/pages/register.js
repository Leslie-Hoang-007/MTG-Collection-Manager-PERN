import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Register = () => {
    // create cookie 
    // NOT SET YET 

    // Variables
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCPassword] = useState("");
    const [email, setEmail] = useState("");
    const [cEmail, setCEmail] = useState("");
    const [error, setError] = useState("");


    // REDIRECT TO SIGN UP
    const redirectSignup = () => { navigate('/account/signin') };
    // Navigation
    const navigate = useNavigate();

    // fetch register
    const handleSubmit = async (event) => {// async
        event.preventDefault();// prevent refresh THEN NAVIGATE DASHBOARD
        // Check if email and email confirmation match
        if (email !== cEmail) {
            setError("Email and email confirmation do not match.");
            return; // EXIT
        } else if (password !== cPassword) {
            setError("Passwords do not match.");
            return; // EXIT
        } else {
            setError("");
        }

        try {
            const baseURL = process.env.NODE_ENV === 'production' ? "/api/register" : "http://localhost:5000/api/register";
            const result = await axios.post(baseURL, {// fetch api
                username,
                email,
                password,
            });
            if (result.data.status == "EMAIL ADDRESS IN USE") {
                setError("This email address is already in use.");
                return;
            }
            if (result.data.status == "ACCOUNT CREATION SUCCESSFUL") {
                // setCookies("access_token", result.data.user_id);
                // setCookies("collection_id", result.data.collection_id);
                // setCookies("wishlist_id", result.data.wishlist_id);

                // window.localStorage.setItem("user_id", result.data.user_id);// set local sotrage to userid
                navigate("/account/signin");// navigate to home page
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (

        <main className="main">
            <div className="container">
                <div className="header-container">
                    <h1>Register an account</h1>

                </div>
                <div className="auth-container">
                    <form onSubmit={handleSubmit}>
                        {error && <p className="error-message">{error}</p>}
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                            />
                        </div>
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
                            <label htmlFor="cemail">Email address confirmation:</label>
                            <input
                                type="text"
                                id="cEmail"
                                value={cEmail}
                                onChange={(event) => setCEmail(event.target.value)}
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
                        <div className="form-group">
                            <label htmlFor="password">Confirm Password:</label>
                            <input
                                type="password"
                                id="cPassword"
                                value={cPassword}
                                onChange={(event) => setCPassword(event.target.value)}
                            />

                        </div>
                        <div className="form-group">
                            <button type="submit" id="signin" >Create my account!</button>
                            <button onClick={redirectSignup} id="register">Sign in</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};
