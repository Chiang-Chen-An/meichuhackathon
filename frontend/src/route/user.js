import axios from 'axios';

export async function login(data) {
    try {
        const base_url = 'http://127.0.0.1:8000';
        const response = await axios.post(`${base_url}/login`, data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export async function register(data) {
    try {
        const base_url = 'http://127.0.0.1:8000';
        const response = await axios.post(`${base_url}/register`, data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}