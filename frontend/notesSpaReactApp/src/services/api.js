import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// AUTH ENDPOINTS
export const auth = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
};

// NOTES ENDPOINTS
export const notes = {
    // Get all notes
    getAll: () => api.get('/notes'),

    // Get active notes (not archived)
    getActive: () => api.get('/notes/active'),

    // Get archived notes
    getArchived: () => api.get('/notes/archived'),

    // Get single note by ID
    getById: (id) => api.get(`/notes/${id}`),

    // Create new note
    create: (data) => api.post('/notes', data),

    // Update existing note
    update: (id, data) => api.put(`/notes/${id}`, data),

    // Delete note
    delete: (id) => api.delete(`/notes/${id}`),

    // Archive note
    archive: (id) => api.patch(`/notes/${id}/archive`),

    // Unarchive note
    unarchive: (id) => api.patch(`/notes/${id}/unarchive`),
};

// CATEGORIES ENDPOINTS
export const categories = {
    // Get all categories
    getAll: () => api.get('/categories'),

    // Create new category
    create: (data) => api.post('/categories', data),

    // Delete category
    delete: (id) => api.delete(`/categories/${id}`),

    // Add category to note
    addToNote: (noteId, categoryId) => api.post(`/notes/${noteId}/categories/${categoryId}`),

    // Remove category from note
    removeFromNote: (noteId, categoryId) => api.delete(`/notes/${noteId}/categories/${categoryId}`),

    // Get notes by category
    getNotesByCategory: (categoryId) => api.get(`/notes/by-category/${categoryId}`),
};

export default api;
