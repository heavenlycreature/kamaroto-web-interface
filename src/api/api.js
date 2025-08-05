import axios from 'axios';

// Buat instance axios baru
const api = axios.create({
    baseURL: 'http://localhost:3000', // Sesuaikan dengan base URL backend Anda
});

// Interceptor untuk request (sudah benar, tidak perlu diubah)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthError = error.response?.status === 401;
        const isNotLoginOrResubmit = !error.config?.url?.includes('/login') && !error.config?.url?.includes('/resubmit');

        // Hanya logout otomatis jika token benar-benar tidak valid/hilang di rute terproteksi
        if (isAuthError && isNotLoginOrResubmit) {
            console.warn("Sesi tidak valid. Logout otomatis.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login?sessionExpired=true';
        }

        return Promise.reject(error);
    }
);

export default api;