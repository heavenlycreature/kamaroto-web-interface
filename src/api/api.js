import axios from 'axios';

// Buat instance axios baru
const api = axios.create({
    baseURL: 'http://localhost:3000', // Sesuaikan dengan base URL backend Anda
});

// Interceptor untuk SETIAP request yang dikirim
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Tambahkan header Authorization secara otomatis
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor untuk SETIAP response yang diterima
api.interceptors.response.use(
    (response) => {
        // Jika response sukses, langsung kembalikan
        return response;
    },
    (error) => {
        
        setTimeout(() => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                console.log("Token tidak valid atau kedaluwarsa. Logout otomatis.");
                
                // Hapus data dari localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // Tunggu 300ms sebelum mengarahkan ulang
                
                // Arahkan ke halaman login dengan pesan
                // Menggunakan window.location.href akan me-refresh total aplikasi & membersihkan semua state
                window.location.href = '/login?sessionExpired=true';
            }
        }, 3000);// Cek jika error disebabkan oleh token yang tidak valid atau kedaluwarsa (401 atau 403)
        
        // Kembalikan error agar bisa ditangani oleh komponen jika itu bukan error otentikasi
        return Promise.reject(error);
    }
);

export default api;