import axios from 'axios';

export async function get_jobs() {
    try {
        const base_url = 'http://127.0.0.1:8000';
        const response = await axios.get(`${base_url}/job`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}