import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Konfirmasi", cancelText = "Batal", intent = 'danger' }) => {
    if (!isOpen) return null;

    // Menentukan warna tombol berdasarkan 'intent' (maksud aksi)
    const confirmButtonClasses = {
        success: "bg-green-500 hover:bg-green-600",
        danger: "bg-red-500 hover:bg-red-600",
    };

    const buttonClass = confirmButtonClasses[intent] || confirmButtonClasses.danger;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button 
                        onClick={onClose} 
                        className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className={`cursor-pointer px-4 py-2 text-white font-semibold rounded-lg transition-colors ${buttonClass}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
