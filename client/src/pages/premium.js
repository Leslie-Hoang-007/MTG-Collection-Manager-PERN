
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
        }
        if (query.get('success')) {
            setSuccess(true);
            setSessionId(query.get('session_id'));
            fetchCreateSub();
            console.log(query);
        }

        if (query.get('canceled')) {
            setSuccess(false);
            setMessage(
                "Order canceled -- continue to shop around and checkout when you're ready."
            );
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
            window.location.reload(); // Redirect to the checkout URL
            window.location.href = "http://localhost:3000/premium2"
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
                    <h3>Starter plan</h3>
                    <h5>$20.00 / month</h5>
                </div>
            </div>
            <button onClick={fetchCheckout}>Subscribe</button>

        </section>
    );

    const SuccessDisplay = ({ button_text }) => {
        return (
            <section>
                <div className="product Box-root">
                    <div className="description Box-root">
                        <h3>Subscription to starter plan successful!</h3>
                    </div>
                </div>
                <button onClick={() => fetchBillingPortal()}>{button_text}</button>

            </section>
        );
    };

    const Message = ({ message }) => (
        <section>
            <p>{message}</p>
        </section>
    );
    if (!success && message === '') {
        return (



            <main className="main">
                <div className="container">
                    {cookies.isAdmin === 'member' && (
                        <ProductDisplay />
                    )}
                    {cookies.isAdmin === 'subscriber' && (
                        <SuccessDisplay button_text={'Update subscription'} />
                    )}
                    {cookies.isAdmin === 'unsubscriber' && (
                        <SuccessDisplay button_text={'Renew subscription'} />
                    )}
                    {cookies.isAdmin === '' && (
                        <SuccessDisplay button_text={'Renew subscription'} />
                    )}

                    <h1>Go for premium</h1>
                    <p>
                        Keep track of your Magic the Gathering card collection without any limits.

                        Premium is for free until paid subscriptions are launched. Check out the frequently asked questions for more info.
                    </p>

                    <div>
                        <h1>Billed Monthly</h1>
                        <p>$3.99/month</p>

                        <h1>Billed yearly</h1>
                        <p>$40.00 total - save $7.88</p>

                    </div>

                    <div>
                        <table>
                            <tr>
                                <th>Feature</th>
                                <th>Free</th>
                                <th>Premium</th>
                            </tr>
                            <tr>
                                <td>Add cards to your collection</td>
                                <td>400 unique card variants</td>
                                <td>Unlimited</td>
                            </tr>
                            <tr>
                                <td>Manage your collection by card language and condition</td>
                                <td>Yes</td>
                                <td>Yes</td>
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
                                <td>View your collection progress and various in-depth statistics</td>
                                <td>Yes</td>
                                <td>Yes</td>
                            </tr>
                            <tr>
                                <td>Share your collection with others</td>
                                <td>Yes</td>
                                <td>Yes</td>
                            </tr>
                            <tr>
                                <td>Add cards to your wishlist</td>
                                <td>300 unique cards</td>
                                <td>Unlimited</td>
                            </tr>
                            <tr>
                                <td>Add notes to cards</td>
                                <td>30 card notes</td>
                                <td>Unlimited</td>
                            </tr>
                            <tr>
                                <td>Create card lists</td>
                                <td>3 card lists</td>
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
                        </table>
                    </div>
                </div>
            </main >
        );
    } else if (success && sessionId !== '') {
        return <SuccessDisplay sessionId={sessionId} />;
    } else {
        return <Message message={message} />;
    }
}


//     return (

//         <main className="main">
//             <div className="container">
//                 <form onSubmit={handleSubmit}>
//                     <p className="text-black mb-4">Complete your payment here!</p>
//                     <PaymentElement />
//                     <button className='bg-black rounded-xl text-white p-2 mt-6 mb-2' disabled={isLoading || !stripe || !elements}>
//                         {isLoading ? "Loading..." : "Pay now"}
//                     </button>
//                     {message && <div>{message}</div>}
//                 </form>
//                 <h1>Go for premium</h1>
//                 <p>
//                     Keep track of your Magic the Gathering card collection without any limits.

//                     Premium is for free until paid subscriptions are launched. Check out the frequently asked questions for more info.
//                 </p>

//                 <div>
//                     <h1>Billed Monthly</h1>
//                     <p>$3.99/month</p>
//                     <button>Get Premium</button>

//                     <h1>Billed yearly</h1>
//                     <p>$40.00 total - save $7.88</p>
//                     <button>Get Premium</button>

//                 </div>

//                 <div>
//                     <table>
//                         <tr>
//                             <th>Feature</th>
//                             <th>Free</th>
//                             <th>Premium</th>
//                         </tr>
//                         <tr>
//                             <td>Add cards to your collection</td>
//                             <td>400 unique card variants</td>
//                             <td>Unlimited</td>
//                         </tr>
//                         <tr>
//                             <td>Manage your collection by card language and condition</td>
//                             <td>Yes</td>
//                             <td>Yes</td>
//                         </tr>
//                         <tr>
//                             <td>Add graded cards to your collection</td>
//                             <td>10 unique card variants</td>
//                             <td>Unlimited</td>
//                         </tr>
//                         <tr>
//                             <td>Add tags to cards in your collection</td>
//                             <td>3 unique tags</td>
//                             <td>Unlimited</td>
//                         </tr>
//                         <tr>
//                             <td>View your collection progress and various in-depth statistics</td>
//                             <td>Yes</td>
//                             <td>Yes</td>
//                         </tr>
//                         <tr>
//                             <td>Share your collection with others</td>
//                             <td>Yes</td>
//                             <td>Yes</td>
//                         </tr>
//                         <tr>
//                             <td>Add cards to your wishlist</td>
//                             <td>300 unique cards</td>
//                             <td>Unlimited</td>
//                         </tr>
//                         <tr>
//                             <td>Add notes to cards</td>
//                             <td>30 card notes</td>
//                             <td>Unlimited</td>
//                         </tr>
//                         <tr>
//                             <td>Create card lists</td>
//                             <td>3 card lists</td>
//                             <td>Unlimited</td>
//                         </tr>
//                         <tr>
//                             <td>In-depth filtering and sorting of cards</td>
//                             <td>Yes</td>
//                             <td>Yes</td>
//                         </tr>
//                         <tr>
//                             <td>View pricing information for your collection, expansions, cards and variants</td>
//                             <td>Yes</td>
//                             <td>Yes</td>
//                         </tr>
//                         <tr>
//                             <td>View a history of your recent activity, such as changes to your collection</td>
//                             <td>Yes</td>
//                             <td>Yes</td>
//                         </tr>
//                         <tr>
//                             <td>Export your collection, wishlist, card lists and notes</td>
//                             <td>Yes</td>
//                             <td>Yes</td>
//                         </tr>
//                     </table>
//                 </div>
//             </div>
//         </main>

//     );
// };