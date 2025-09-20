import axios from 'axios';

export async function login(data) {
    try {
        const base_url = 'backend:8000';
        const response = await axios.post({
            url: `${base_url}/login`,
            data
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}


export async function register(data) {
    try {
        const base_url = 'backend:8000';
        const response = await axios.post({
            url: `${base_url}/register`,
            data
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}