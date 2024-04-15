import { Link, useNavigate, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

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
                    <img src="https://mtgproshop.com/wp-content/uploads/2020/10/Jace-Poster-Banner-V2-2880x960-1-scaled.jpg.webp"/>
                    <img src="https://images.squarespace-cdn.com/content/v1/6117360e2f0be106838fc4e6/dd8d55d6-e913-453b-a0b1-139cf3564981/MTG-25th-Anniversary.jpg"/>
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