import axios from 'axios';

export async function get_jobs() {
    try {
        const base_url = 'backend:8000';
        const response = await axios.post({
            url: `${base_url}/job`
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}