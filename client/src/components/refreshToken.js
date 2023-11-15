
import axios from "axios";


const HandleRefreshToken = async () => {
    console.log('Access token expired. Refreshing token...');
    try {
        const response = await axios.post('http://localhost:5000/api/refreshtoken', {}, { withCredentials: true });
        console.log('Token refreshed:', response.data.accessToken);
        // Perform any additional actions after refreshing the token
    } catch (error) {
        console.error('Error refreshing token:', error.message);
    }
};

export default HandleRefreshToken;