import { Link, useNavigate, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import HandleRefreshToken from "../components/refreshToken";
import * as XLSX from "xlsx";

export const Admin = () => {
    // cookies
    const [cookies, setCookies] = useCookies();
    const [logs, setLogs] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (!cookies.isAdmin) {
            navigate("/");
        } else {
            fetchAllLogs();
        }
    }, [])

    const fetchAllLogs = async () => {
        try {
            const baseURL = process.env.NODE_ENV === 'production' ? `/api/alllogs` : "http://localhost:5000/api/alllogs";
            const response = await axios.get(baseURL, { withCredentials: true });
            const data = response.data.logs.rows;
            setLogs(data);
            console.log(data);
        } catch (error) {
            if (error.response && error.response.status === 419) {
                await HandleRefreshToken();
                // Retry the original request
                await fetchAllLogs();
            } else {
                console.error("Error accessing logs:", error);
            }
        }
    };

    const renderLogs = () => {
        const disp_logs = []

        for (let i = 0; i < logs.length; i += 1) {
            const row = (
                <tr>
                    <td>{logs[i].date_time}</td>
                    <td>{logs[i].user_id}</td>
                    <td>{logs[i].log}</td>
                    <td>{logs[i].wishlist === true ? 'Wishlist' : logs[i].wishlist == false ? 'Collection' : 'Other'}</td>
                    <td>{logs[i].card_id}</td>
                    <td>{logs[i].cardincollection_id}</td>
                    <td>{logs[i].collection_id}</td>
                </tr>);
            disp_logs.push(row);
        }
        console.log({ disp_logs });
        return (
            <tbody>
                {disp_logs}
            </tbody>
        )
    }

    // generate report
    const handleGenerateReport = () => {
        const headers = ["Lod ID", "Date", "User Id #", "Description", "Type", "Card ID", "Cardincollection ID", "Collection ID"];

        const wsData = [headers, ...logs.map(log => [
            log.logs_id,
            log.date_time,
            log.user_id,
            log.log,
            log.wishlist === true ? 'Wishlist' : (log.wishlist === false ? 'Collection' : 'Other'),
            log.card_id,
            log.cardincollection_id,
            log.collection_id,
        ])];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Logs");
        const fileName = "logs_report.xlsx";
        XLSX.writeFile(wb, fileName);
    };
    return (
        <main className="main">
            <div className="container">
                <h1>ADMIN CONTROLS</h1>
                <button onClick={handleGenerateReport}>Generate Report</button>
                <br />
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>User Id #</th>
                            <th>Description</th>
                            <th>Type</th>
                            <th>Card ID</th>
                            <th>Cardincollection ID</th>
                            <th>Collection ID</th>
                        </tr>
                    </thead>
                    {renderLogs()}
                </table>
            </div>
        </main>
    );
};