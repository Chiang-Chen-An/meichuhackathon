import axios from 'axios';


export async function savedJob(data) {
    try {
        const base_url = 'http://127.0.0.1:8000';
        const response = await axios.post(`${base_url}/user/jobs`, data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export async function getSavedJob() {
    try {
        const base_url = 'http://127.0.0.1:8000';
        const response = await axios.get(`${base_url}/user/jobs`, data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}