import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

export const Navbar = () => {
    // cookies
    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
    const location = useLocation();

    // Function to handle logout
    const fetchLogout = async () => {
        const user_id = cookies.access_token;
        const baseURL =
            process.env.NODE_ENV === "production"
                ? "/api/logout"
                : "http://localhost:5000/api/logout";
        const response = await axios.put(baseURL, { user_id });
        // console.log(response);
        navigate("/");

    };

    const logout = () => {
        setCookies("access_token", "");
        setCookies("collection_id", "");
        setCookies("wishlist_id", "");
        window.localStorage.clear();
        fetchLogout();
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
                        {cookies.access_token && (
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
                    </ul>

                    {/* Login/Logout Links */}
                    <ul className="nav-login">
                        <li className="navbar-item">
                            {!cookies.access_token && (
                                <Link
                                    to="/account/register"
                                    className={`custom-link ${isActive("/account/register") ? "active" : ""}`}
                                >
                                    Register
                                </Link>
                            )}
                        </li>
                        <li className="navbar-item">
                            {!cookies.access_token && (
                                <Link
                                    to="/account/signin"
                                    className={`custom-link ${isActive("/account/signin") ? "active" : ""}`}
                                >
                                    Sign in
                                </Link>
                            )}
                        </li>
                        <li className="navbar-item">
                            {cookies.access_token && (
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