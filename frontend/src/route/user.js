import axios from 'axios';

export async function login(data) {
    try {
        base_url = 'backend:8000'
        const response = await axios({
            url: base_url,
            data
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}