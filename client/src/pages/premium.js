import { Link, useNavigate, Redirect } from "react-router-dom";
import { useEffect } from "react";

export const Premium = () => {

    const navigate = useNavigate();
    useEffect(() => {
        // if (user_id) {
        //     navigate("/dashboard");
        // }
    }, [])


    return (
        <main className="main">
        <div className="container">
            <h1>Go for premium</h1>
            <p>
                Keep track of your Magic the Gathering card collection without any limits.

                Premium is for free until paid subscriptions are launched. Check out the frequently asked questions for more info.
            </p>

            <div>
                <h1>Billed Monthly</h1>
                <p>$3.99/month</p>
                <button>Get Premium</button>

                <h1>Billed yearly</h1>
                <p>$40.00 total - save $7.88</p>
                <button>Get Premium</button>

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
        </main>
    );
};