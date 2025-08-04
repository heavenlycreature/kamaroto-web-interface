// components/profile/RejectedStatusView.jsx
// Komponen ini menampilkan informasi saat pendaftaran pengguna ditolak.

import React from 'react';
import Sidebar from './ProfileSidebar'; // Asumsi sidebar ada di folder yang sama

const RejectedStatusView = ({ user, onEditClick }) => {
    // State untuk sidebar mobile (jika diperlukan di masa depan)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="md:flex md:min-h-screen">
                <Sidebar 
                    userName={user.name} 
                    userEmail={user.email} 
                    userAvatar={user.avatar} 
                    userStatus={user.status} 
                    isOpen={isSidebarOpen} 
                    setIsOpen={setIsSidebarOpen} 
                />
                <main className="flex-1 p-8 md:p-12 flex items-center justify-center">
                    <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md text-center">
                        <h1 className="text-2xl font-bold text-red-600">Pendaftaran Anda Ditolak</h1>
                        <p className="mt-4 text-gray-600">Alasan Penolakan:</p>
                        <p className="mt-2 font-semibold text-gray-800 bg-red-50 p-3 rounded-md">
                            {user.rejection_reason || 'Tidak ada alasan spesifik yang diberikan.'}
                        </p>
                        {user.resubmit_allowed && (
                            <div className="mt-6">
                                <p className="text-gray-600 mb-4">Anda diizinkan untuk memperbaiki dan mengirim ulang data Anda.</p>
                                <button 
                                    onClick={onEditClick} 
                                    className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600"
                                >
                                    Edit & Kirim Ulang Formulir
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RejectedStatusView;
