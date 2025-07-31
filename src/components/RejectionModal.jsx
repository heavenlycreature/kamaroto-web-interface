// components/admin/RejectionModal.jsx
// Komponen modal untuk memberikan alasan penolakan.

import React, { useState } from 'react';

const RejectionModal = ({ isOpen, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');
    const [allowResubmit, setAllowResubmit] = useState(true);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!reason.trim()) {
            alert('Alasan penolakan tidak boleh kosong.');
            return;
        }
        onSubmit(reason, allowResubmit);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Konfirmasi Penolakan</h2>
                <p className="text-gray-600 mb-4">Harap berikan alasan mengapa pendaftaran ini ditolak.</p>
                
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Contoh: Foto selfie tidak jelas, data tidak sesuai, dll."
                    className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                ></textarea>

                <div className="mt-4 flex items-center">
                    <input
                        type="checkbox"
                        id="allowResubmit"
                        checked={allowResubmit}
                        onChange={(e) => setAllowResubmit(e.target.checked)}
                        className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="allowResubmit" className="ml-2 text-sm text-gray-700">
                        Izinkan pengguna untuk mendaftar ulang
                    </label>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                        Batal
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">
                        Kirim Penolakan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectionModal;
