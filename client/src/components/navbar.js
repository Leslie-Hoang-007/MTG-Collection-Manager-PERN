import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import HandleRefreshToken from "./refreshToken";

export const Navbar = () => {
    // cookies
    const [cookies, setCookies] = useCookies();
    const navigate = useNavigate();
    const location = useLocation();

    // Function to handle logout
    const fetchLogout = async () => {
        try {
            const baseURL =
                process.env.NODE_ENV === "production"
                    ? "/api/logout"
                    : "http://localhost:5000/api/logout";
            const response = await axios.put(baseURL, {}, { withCredentials: true });
            console.log(response);
            navigate("/");
        } catch (error) {
            // If the request returns a 419, attempt to refresh the token and retry
            if (error.response && error.response.status === 419) {
                await HandleRefreshToken();
                // Retry the original request
                await fetchLogout();
            } else {
                console.error('Error:', error);
                setCookies("signedIn", "",);
                setCookies("isAdmin", "");
                navigate("/");// navigate to home page

            }
        }

    };



    const logout = () => {
        fetchLogout();
        setCookies("signedIn", "");
        setCookies("isAdmin", "");
        navigate("/");// navigate to home page
    };

    // Function to check if a link is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="navbar" id="navbar-sticky">
            <div className="container">
                <div className="navbar-content">
                    {/* Logo */}
                    <Link to="/" className="custom-link" id="logo">
                        <img
                            className="logo"
                            src={process.env.PUBLIC_URL + "/logo.png"}
                            alt="logo MTG Collection Manager"
                        />
                    </Link>

                    {/* Navigation Links */}
                    <ul id="navbar-menu">
                        <li className="navbar-item">
                            <Link
                                to="/"
                                className={`custom-link`}
                                id="logo"
                            >
                                MTGCollector
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link
                                to="/dashboard"
                                className={`custom-link ${isActive("/dashboard") ? "active" : ""}`}
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li className="navbar-item">
                            <Link
                                to="/cards"
                                className={`custom-link ${isActive("/cards") ? "active" : ""}`}
                            >
                                Cards
                            </Link>
                        </li>
                        {cookies.signedIn && (
                            <>
                                <li className="navbar-item">
                                    <Link
                                        to="/collection"
                                        className={`custom-link ${isActive("/collection") ? "active" : ""}`}
                                    >
                                        Collection
                                    </Link>
                                </li>
                                <li className="navbar-item">
                                    <Link
                                        to="/wishlist"
                                        className={`custom-link ${isActive("/wishlist") ? "active" : ""}`}
                                    >
                                        Wishlist
                                    </Link>
                                </li>
                            </>
                        )}
                        <li className="navbar-item">
                            <Link
                                to="/premium"
                                className={`custom-link ${isActive("/premium") ? "active" : ""}`}
                            >
                                Premium
                            </Link>
                        </li>
                        
                        {cookies.isAdmin === 'admin' && (
                            <li className="navbar-item">
                                <Link
                                    to="/admin"
                                    className={`custom-link ${isActive("/admin") ? "active" : ""}`}
                                >
                                    Admin
                                </Link>
                            </li>
                        )}
                    </ul>

                    {/* Login/Logout Links */}
                    <ul className="nav-login">
                        <li className="navbar-item">
                            {!cookies.signedIn && (
                                <Link
                                    to="/account/register"
                                    className={`custom-link ${isActive("/account/register") ? "active" : ""}`}
                                >
                                    Register
                                </Link>
                            )}
                        </li>
                        <li className="navbar-item">
                            {!cookies.signedIn && (
                                <Link
                                    to="/account/signin"
                                    className={`custom-link ${isActive("/account/signin") ? "active" : ""}`}
                                >
                                    Sign in
                                </Link>
                            )}
                        </li>
                        <li className="navbar-item">
                            {cookies.signedIn && (
                                <Link onClick={logout} className="custom-link">
                                    Sign out
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};