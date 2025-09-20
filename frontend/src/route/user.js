import axios from 'axios';
import  { API_BASE_URL } from '../config/config'

export async function login(data) {
    try {
        const base_url = API_BASE_URL;  // 改為 localhost
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
        const base_url = API_BASE_URL;  // 改為 localhost
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
        const base_url = API_BASE_URL;
        const response = await axios.post(`${base_url}/update/username`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data: error;
    }
}

export async function getCurrentUser() {
    try {
        const base_url = API_BASE_URL;
        const response = await axios.get(`${base_url}/current_user`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export async function updateProfile(data) {
    try {
        const base_url = API_BASE_URL;
        const response = await axios.put(`${base_url}/user/profile`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export async function logout() {
    try {
        const base_url = API_BASE_URL;
        const response = await axios.post(`${base_url}/logout`, {}, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}