import { Link, useNavigate, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

export const Home = () => {
    // cookies
    const [cookies, setCookies] = useCookies(["access_token"])

    const navigate = useNavigate();
    const user_id = cookies.access_token;
    useEffect(() => {
        if (user_id) {
            navigate("/dashboard");
        }
    }, [])

    // REDIRECT TO SIGN UP
    const redirectSignup = () => { navigate('/account/register') };
    // REDIRECT TO SIGN UP
    const redirectCards = () => { navigate('/cards') };

    return (
        <main className="main">
            <div className="container">
                <div className="home-header">
                    <img src="https://mtgproshop.com/wp-content/uploads/2020/10/Jace-Poster-Banner-V2-2880x960-1-scaled.jpg.webp"/>
                    <div className="home-block">
                        <h1>Track Your Magic the Gathering card collection</h1>
                        <p>An MTG card database and collection tracker. Create an account to start collecting</p>
                        <div className="form-group">
                            <button onClick={redirectSignup} id="signin">Create Account</button>
                            <button onClick={redirectCards} id="register">Search Card</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};