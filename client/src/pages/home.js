import { Link, useNavigate, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import {useEffect} from "react";

export const Home = () => {
    // cookies
    const [cookies, setCookies] = useCookies(["access_token"])

    const navigate = useNavigate();
    const user_id = cookies.access_token;
    useEffect(()=>{
        if (user_id){
            navigate("/dashboard");
        }
    },[])


    return (
        <div>
            <h1>Track Your Magic the Gathering card collection</h1>
            <p>An MTG card database and collection tracker.<br/>Create an account to start collecting</p>
            <Link to="/account/register">Create Account</Link>
            <br/>
            <Link to="/cards">Search Card</Link>
        </div>
    );
};