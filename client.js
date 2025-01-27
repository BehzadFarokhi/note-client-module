const axios = require('axios');

const API_URL = 'http://localhost:3001';
let accessToken = ''; 
let refToken = '';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Register User
async function register(userData) {
    try {
        const response = await axiosInstance.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Registration Error:', error.response?.data || error.message);
        throw error;
    }
}

// Login
async function login(credentials) {
    try {
        const response = await axiosInstance.post('/auth/login', credentials);
        accessToken = response.data.accessToken;
        refToken = response.data.refreshToken;
        return response.data;
    } catch (error) {
        console.error('Login Error:', error.response?.data || error.message);
        throw error;
    }
}

// Refresh the access token
async function refreshToken(refToken) {
    try {
        const response = await axiosInstance.post('/auth/refresh-token', { refreshToken: refToken });
        accessToken = response.data.accessToken;
        refToken = response.data.refToken;
        return response.data;
    } catch (error) {
        console.error('Refresh Token Error:', error.response?.data || error.message);
        throw error;
    }
}

// Logout
async function logout() {
    try {
        if (!refToken) {
            throw new Error('Refresh token is required');
        }
        console.log('Logging out with refreshToken:', refToken);

        const response = await axiosInstance.delete('/auth/logout', {
            data: { refreshToken: refToken },
        });

        accessToken = '';
        refToken = '';

        return response.data;
    } catch (error) {
        console.error('Logout Error:', error.response?.data || error.message);
        throw error;
    }
}

async function makeRequestWithTokenRefresh(method, url, data = {}) {
    try {
        const response = await axiosInstance.request({
            url,
            method,
            data,
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token expired, attempt to refresh it
            console.log('Access token expired. Refreshing token...');
            const refreshResponse = await refreshToken(refToken);

            if (refreshResponse && refreshResponse.accessToken) {
                // Retry the original API request with the new access token
                accessToken = refreshResponse.accessToken;
                const retryResponse = await axiosInstance.request({
                    url,
                    method,
                    data,
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                return retryResponse.data;
            } else {
                console.error('Failed to refresh token.');
                // Handle token refresh failure (e.g., redirect to login)
                throw new Error('Failed to refresh token');
            }
        } else {
            console.error('API Request Error:', error.response?.data || error.message);
            throw error;  // Handle other errors (e.g., network issues)
        }
    }
}

// Add a new note (requires authentication)
async function addNote(noteData) {
    return makeRequestWithTokenRefresh('POST', '/note/add', noteData);
}

// Get a note by ID (requires authentication)
async function getNote(id) {
    return makeRequestWithTokenRefresh('GET', `/note/get/${id}`);
}

// List all notes (requires authentication)
async function listNotes() {
    return makeRequestWithTokenRefresh('GET', '/note/list');
}

// Update a note (requires authentication)
async function editNote(id, noteData) {
    return makeRequestWithTokenRefresh('PUT', `/note/edit/${id}`, noteData);
}

// Delete a note (requires authentication)
async function deleteNote(id) {
    return makeRequestWithTokenRefresh('DELETE', `/note/delete/${id}`);
}

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    addNote,
    getNote,
    listNotes,
    editNote,
    deleteNote
};
