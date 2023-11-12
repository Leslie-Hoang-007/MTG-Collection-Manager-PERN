import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

export const Navbar = () => {
    // cookies
    const [cookies, setCookies] = useCookies(["access_token"])

    const navigate = useNavigate();


    const fetchLogout = async () =>{
        const user_id = cookies.access_token
        const baseURL = process.env.NODE_ENV === 'production' ? '/api/logout' : 'http://localhost:5000/api/logout';
        const response = await axios.put(baseURL,{user_id});
        console.log(response);
    };
    // logout
    const logout = () => {
        fetchLogout();
        setCookies("access_token", "");  // set cookies to ""
        setCookies("collection_id", "");  // set cookies to ""
        setCookies("wishlist_id", "");  // set cookies to ""
        window.localStorage.clear(); // clear local storage
        navigate("/");// navigate to auth page
    };

    return (<div className="navbarbg">
        <div className="navbar">
            <Link to="/" className="custom-link">MTGCollector</Link>
            <Link to="/dashboard" className="custom-link">Dashboard</Link>
            <Link to="/cards" className="custom-link">Cards</Link>

            {!cookies.access_token && (
                <Link to="/account/register" className="custom-link">Register</Link>
            )
            }

            {!cookies.access_token && (
                <Link to="/account/signin" className="custom-link">Login</Link>
            )}

            {cookies.access_token && (
                <>
                    <Link to="/collection" className="custom-link">Collection</Link>
                    <Link to="/wishlist" className="custom-link">Wishlist</Link>
                </>
            )}

            <Link to="/premium" className="custom-link">Premium</Link>

            {cookies.access_token && (
                <button onClick={logout} className="custom-link">
                    Logout
                </button>
            )}

        </div>

    </div>
    );
};