import axios from 'axios';
import  { API_BASE_URL } from '../config/config'

export async function get_jobs() {
    try {
        const base_url = API_BASE_URL;
        const response = await axios.get(`${base_url}/job`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data: error;
    }
}

export async function get_jobs_by_keyword(data) {
    try {
        const base_url = API_BASE_URL;
        const response = await axios.post(`${base_url}/search/jobs`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data: error;
    }
}

export async function createJob(data) {
    try {
        const base_url = API_BASE_URL;
        const response = await axios.post(`${base_url}/job`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data: error;
    }
}

export async function get_job_by_job_id(job_id) {
    try {
        const base_url = API_BASE_URL;
        const response = await axios.get(`${base_url}/job/${job_id}`, {
            withCredentials: true
        })
        return response.data;
    } catch (error) {
        throw error.response? error.response.data: error;
    }
}