import { Link, useNavigate, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import homeImage from "../media/homepage.jpg";

export const Home = () => {
    // cookies
    const [cookies, _] = useCookies([])

    const navigate = useNavigate();
    const signedIn = cookies.signedIn;
    useEffect(() => {
        if (signedIn) {
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
                    <img src={homeImage} alt="A wisard like man with a cape looking off into the distance."/>
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