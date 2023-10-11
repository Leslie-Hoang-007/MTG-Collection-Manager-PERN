import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Navbar = () => {
    // cookies
    const [cookies, setCookies] = useCookies(["access_token"])

    const navigate = useNavigate();


    // logout
    const logout = () => {
        setCookies("access_token", "");  // set cookies to ""
        window.localStorage.clear(); // clear local storage
        navigate("/auth");// navigate to auth page
    };

    return <div className="navbarbg">
        <div className="navbar">
            <Link to="/dashboard" className="custom-link">Dashboard</Link>
            
            <Link to="/cards" className="custom-link">Cards</Link>
            {!cookies.access_token &&(
                <Link to="/account/register" className="custom-link">Register</Link>
            )
            }
            {!cookies.access_token && (
                <Link to="/account/signin" className="custom-link">Login</Link>
                
            )}
            
            {cookies.access_token &&(
                <>
                    <Link to="/collection" className="custom-link">Collection</Link>
                    <button onClick={logout} className="custom-link">
                        Logout
                    </button>
                </>
            )}
        </div>

    </div>;
};