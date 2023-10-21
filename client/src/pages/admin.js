import { Link, useNavigate, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

export const Admin = () => {
    // cookies
    const [cookies, setCookies] = useCookies(["access_token"])

    const navigate = useNavigate();
    const user_id = cookies.access_token;
    useEffect(() => {
        if (!user_id) {
            navigate("/");
        }
    }, [])


    return (
        <div>
            <h1>ADMIN CONTROLS</h1>
            <button>Generate Report</button>
            <br/>
            <button>Create</button>
            <button>Edit</button>
            <button>Delete</button>
            <table>
                <tr>
                <th>Date</th>
                <th>Account #</th>
                <th>Action</th>
                </tr>
                <tr>
                    <td>today</td>
                    <td>123</td>
                    <td>LOGIN</td>
                </tr>
            </table>
        </div>
    );
};