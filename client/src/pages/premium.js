
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";// for cookies
import { useNavigate } from "react-router-dom";
import HandleRefreshToken from "../components/refreshToken";


import axios from "axios";


export const Premium = () => {
    let [message, setMessage] = useState('');
    let [success, setSuccess] = useState(false);
    let [sessionId, setSessionId] = useState('');

    const [cookies, setCookies] = useCookies();

    // Navigation
    const navigate = useNavigate();

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (cookies.signedIn == true) {
            isAdmin();
            setSuccess(false);
        }
        if (query.get('success')) {
            setSuccess(true);
            setSessionId(query.get('session_id'));
            fetchCreateSub();
            console.log(query);
        } else if (query.get('cancled')) {
            isAdmin();
            navigate('/dashboard');
        }
    }, [sessionId]);


    // Fetch for check if admin 

    const isAdmin = async () => {
        try {
            const baseURL =
                process.env.NODE_ENV === "production"
                    ? "/api/isadmin"
                    : "http://localhost:5000/api/isadmin";
            const response = await axios.get(baseURL, { withCredentials: true });

            setCookies("isAdmin", response.data.message);
            console.log(response.data.message, "asdf");
            console.log(cookies);

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

    const fetchCreateSub = async () => {
        try {
            const session_id = sessionId;
            const baseURL = process.env.NODE_ENV === 'production' ? `/api/create-subscription` : "http://localhost:5000/api/create-subscription";
            const response = await axios.post(baseURL, { session_id }, { withCredentials: true });
            navigate("/premium2");
        } catch (error) {
            // add refresh
        }
    };

    const fetchCheckout = async () => {
        const lookup_key = "price_1OFPUOD3rnaRGeMU5CIVqIPM";
        try {
            const baseURL = process.env.NODE_ENV === 'production' ? `/api/create-checkout-session` : "http://localhost:5000/api/create-checkout-session";
            const response = await axios.post(baseURL, { lookup_key });
            console.log(response.data);
            const url = response.data.url;
            window.location.href = url; // Redirect to the checkout URL
        } catch (error) {

        }
    };

    const fetchBillingPortal = async () => {
        try {
            const baseURL = process.env.NODE_ENV === 'production' ? `/api/create-portal-session` : "http://localhost:5000/api/create-portal-session";
            const response = await axios.post(baseURL, {}, { withCredentials: true });
            console.log(response.data.url);
            const url = response.data.url;
            window.location.href = url; // Redirect to the checkout URL
        } catch (error) {
            // add refresh
        }
    };

    const ProductDisplay = () => (
        <section>
            <div className="product">
                <div className="description">
                    <h1>Billed Monthly</h1>
                    <h3>Subscribe to starter plan!</h3>
                    <h5>$2.99 / month</h5>
                </div>
            </div>
            <button id="signin" onClick={fetchCheckout}>Subscribe</button>

        </section>
    );

    const SuccessDisplay = ({ button_text, message }) => {
        return (
            <section>
                <div className="product Box-root">
                    <div className="description Box-root">

                        <h1>Billed Monthly</h1>
                        <h4>{message}</h4>
                        <h5>$2.99 / month</h5>
                    </div>
                </div>
                <button id="signin" onClick={() => button_text === 'Sign in' ? navigate("/account/signin/") : fetchBillingPortal()}>{button_text}</button>
            </section>
        );
    };

    const Message = ({ message }) => (
        <section>
            <p>{message}</p>
        </section>
    );
    if (!success) {
        return (
            <main className="main">
                <div className="container">


                    <h1>Go for premium</h1>
                    <p>
                        Keep track of your Magic the Gathering card collection without any limits.

                        Premium is for free until paid subscriptions are launched. Check out the frequently asked questions for more info.
                    </p>


                    {cookies.isAdmin === 'member' && (
                        <ProductDisplay />
                    )}
                    {cookies.isAdmin === 'subscriber' && (
                        <SuccessDisplay button_text={'Update subscription'} message={'Current subscription to starter plan successful!'} />
                    )}
                    {cookies.isAdmin === 'unsubscriber' && (
                        <SuccessDisplay button_text={'Renew subscription'} message={'Subscribe to starter plan!'} />
                    )}
                    {cookies.isAdmin==null && (
                        <SuccessDisplay button_text={'Sign in'} message={'Subscribe to starter plan!'} />
                    )}
                    {cookies.isAdmin=='' && (
                        <SuccessDisplay button_text={'Sign in'} message={'Subscribe to starter plan!'} />
                    )}

               

                    <div>
                        <table>
                            <thead>

                                <tr>
                                    <th>Feature</th>
                                    <th>Free</th>
                                    <th>Premium</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Add cards to your collection</td>
                                    <td>10 unique card variants</td>
                                    <td>Unlimited</td>
                                </tr>
                                <tr>
                                    <td>Add graded cards to your collection</td>
                                    <td>10 unique card variants</td>
                                    <td>Unlimited</td>
                                </tr>
                                <tr>
                                    <td>Add tags to cards in your collection</td>
                                    <td>3 unique tags</td>
                                    <td>Unlimited</td>
                                </tr>
                                <tr>
                                    <td>Share your collection with others</td>
                                    <td>Yes</td>
                                    <td>Yes</td>
                                </tr>
                                <tr>
                                    <td>Add cards to your wishlist</td>
                                    <td>10 unique cards</td>
                                    <td>Unlimited</td>
                                </tr>
                                <tr>
                                    <td>In-depth filtering and sorting of cards</td>
                                    <td>Yes</td>
                                    <td>Yes</td>
                                </tr>
                                <tr>
                                    <td>View pricing information for your collection, expansions, cards and variants</td>
                                    <td>Yes</td>
                                    <td>Yes</td>
                                </tr>
                                <tr>
                                    <td>View a history of your recent activity, such as changes to your collection</td>
                                    <td>Yes</td>
                                    <td>Yes</td>
                                </tr>
                                <tr>
                                    <td>Export your collection, wishlist, card lists and notes</td>
                                    <td>Yes</td>
                                    <td>Yes</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </main >
        );
    } else if (success && sessionId !== '') {
        return <SuccessDisplay button_text={'Update subscription'} message={'Subscription to starter plan successful!'} />;
    }
}
