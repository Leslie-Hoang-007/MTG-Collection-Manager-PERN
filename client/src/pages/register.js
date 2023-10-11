import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";// for cookies
import { useNavigate } from "react-router-dom";

export const Register = () => {
    // create cookie 
    // NOT SET YET 
    const [_, setCookies] = useCookies(["access_token"]);

    // Variables
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [cEmail, setCEmail] = useState("");
    const [error, setError] = useState("");


    // Navigation
    const navigate = useNavigate();

    // fetch login
    const handleSubmit = async (event) => {// async
        event.preventDefault();// prevent refresh THEN NAVIGATE DASHBOARD
        // Check if email and email confirmation match
        if (email !== cEmail) {
            setError("Email and email confirmation do not match.");
            return; // EXIT
        }else{
            setError("");
        }

        try {
            const result = await axios.post("http://localhost:5000/register", {// fetch api
                username,
                email,
                password,
            });
            if (result.data.status == "EMAIL ADDRESS IN USE"){
                setError("This email address is already in use.");
                return;
            }
            if (result.data.status == "ACCOUNT CREATION SUCCESSFUL") {
                setCookies("access_token",result.data.user_id);
                // window.localStorage.setItem("user_id", result.data.user_id);// set local sotrage to userid
                navigate("/dashboard");// navigate to home page
            }
        } catch (error) {
            console.error(error);
        }
    };


    return (

        <div className="auth-container">
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
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
                        id="email"
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};
