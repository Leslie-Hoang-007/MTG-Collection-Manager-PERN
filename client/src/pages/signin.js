import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";// for cookies
import { useNavigate } from "react-router-dom";
import HandleRefreshToken from "../components/refreshToken";

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
    const redirectSignup = () => { navigate('/account/register') };

    // fetch login
    const handleSubmit = async (event) => {// async
        event.preventDefault();// prevent refresh THEN NAVIGATE DASHBOARD

        try {
            const baseURL = process.env.NODE_ENV === 'production' ? "/api/login" : "http://localhost:5000/api/login";
            const result = await axios.post(baseURL, {// fetch api
                email,
                password,
            }, { withCredentials: true });
            console.log(result.data.status);
            if (result.data.user_id) {
                // window.localStorage.setItem("user_id", result.data.user_id);// set local sotrage to userid

                setCookies("signedIn", "true");
                await isAdmin();
                // setCookies("collection_id", result.data.collection_id);
                // setCookies("wishlist_id", result.data.wishlist_id);
                navigate("/dashboard");// navigate to home page
            } else {
                // window.location.reload();
                setAttempt(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch for check if admin 

    const isAdmin = async () => {
        try {
            const baseURL =
                process.env.NODE_ENV === "production"
                    ? "/api/isadmin"
                    : "http://localhost:5000/api/isadmin";
            await axios.get(baseURL, { withCredentials: true });
            setCookies("isAdmin", "true");
        } catch (error) {
            // If the request returns a 419, attempt to refresh the token and retry
            if (error.response && error.response.status === 419) {
                await HandleRefreshToken();
                // Retry the original request
                await isAdmin();
            } else {
                console.error('Error not admin:', error);
            }
        }
    }

    let message;

    if (attempt) {
        message = <h1>Invalid Credientials</h1>;
    }

    return (
        <main className="main">
            <div className="container">
                <div className="header-container">
                    <h1>Sign in to your account</h1>
                </div>

                <div className="auth-container">
                    {message}
                    <form onSubmit={handleSubmit}>
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
                        <div className="form-group">

                            <button type="submit" id="signin">Sign in</button>
                            <button onClick={redirectSignup} id="register">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};