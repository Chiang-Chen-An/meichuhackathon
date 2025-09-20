import axios from 'axios';

export async function get_jobs() {
    try {
        const base_url = 'http://localhost:8000';
        const response = await axios.get(`${base_url}/job`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data: error;
    }
}

export async function get_jobs_by_keyword(data) {
    // data = {
    //     'name': ,
    //     'type': ,
    //     'date_start': ,
    //     'date_end': ,
    //     'status':
    // }

    try {
        const base_url = 'http://localhost:8000';
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
        const base_url = 'http://127.0.0.1:8000';
        const response = await axios.post(`${base_url}/job`, data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data: error;
    }
}