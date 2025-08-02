// components/profile/ProfileField.jsx
// Versi yang sudah diperbaiki dan lebih kuat

import React from 'react';

const ProfileField = ({ label, value, isEditing, onChange, name, type = "text", children }) => (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            {
                // [LOGIKA BARU YANG LEBIH BAIK]
                // Jika ada children, selalu tampilkan children.
                // Biarkan komponen induk yang mengatur apa isinya (span atau select).
                children ? children : (
                    // Jika tidak ada children, gunakan logika default
                    isEditing ? (
                        <input
                            type={type} name={name} value={value} onChange={onChange}
                            className="block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                    ) : (
                        <span className="font-semibold">{value || '-'}</span>
                    )
                )
            }
        </dd>
    </div>
);

export default ProfileField;