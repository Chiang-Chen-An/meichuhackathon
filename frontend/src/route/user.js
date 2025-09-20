import axios from 'axios';

export async function login(data) {
    try {
        const base_url = 'http://localhost:8000';  // 改為 localhost
        const response = await axios.post(`${base_url}/login`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export async function register(data) {
    try {
        const base_url = 'http://localhost:8000';  // 改為 localhost
        const response = await axios.post(`${base_url}/register`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export async function updateUsername() {
    try {
        const base_url = 'http://127.0.0.1:8000';
        const response = await axios.post(`${base_url}/update/username`, data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data: error;
    }
}