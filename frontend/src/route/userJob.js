import axios from 'axios';


export async function savedJob(data) {
    try {
        const base_url = 'http://localhost:8000';
        const response = await axios.post(`${base_url}/user/jobs`, data, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export async function getSavedJob() {
    try {
        const base_url = 'http://localhost:8000';
        const response = await axios.get(`${base_url}/user/jobs`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export async function checkJobSaved(jobId) {
    try {
        const base_url = 'http://localhost:8000';
        const response = await axios.get(`${base_url}/user/jobs/check/${jobId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export async function batchCheckJobsSaved(jobIds) {
    try {
        const base_url = 'http://localhost:8000';
        const response = await axios.post(`${base_url}/user/jobs/batch_check`, {
            job_ids: jobIds
        }, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

export async function unsaveJob(jobId) {
    try {
        const base_url = 'http://localhost:8000';
        const response = await axios.delete(`${base_url}/user/jobs/${jobId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}