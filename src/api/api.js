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

// Interceptor untuk response (yang diperbaiki)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Cek jika ada objek 'response' pada error
        if (error.response) {
            const user = JSON.parse(localStorage.getItem('user'));
            const isAuthError = error.response.status === 401 || error.response.status === 403;
            // Cek apakah URL request BUKAN '/login'
            const isNotLoginPage = error.config.url !== '/login';

             if (user?.status === 'rejected' && window.location.pathname.includes('/resubmit')) {
                return Promise.reject(error); // Biarkan komponen menangani error
            }

            // HANYA jalankan logout otomatis jika KEDUA kondisi terpenuhi
            if (isAuthError && isNotLoginPage && userData?.status !== 'rejected') {
                console.log("Token tidak valid atau sesi kedaluwarsa. Logout otomatis.");
                
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                window.location.href = '/login?sessionExpired=true';
            }
        }
        
        // Selalu kembalikan error agar komponen (seperti Login.jsx) bisa menanganinya
        return Promise.reject(error);
    }
);
export default api;