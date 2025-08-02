// components/ui/InfoCard.jsx
// Komponen kartu generik untuk menampilkan informasi.

import React from 'react';

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>;

const InfoCard = ({ title, description, onEdit, isEditing, children, footer }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
                {onEdit && !isEditing && (
                    <button onClick={onEdit} className="flex items-center space-x-2 px-4 py-2 bg-orange-100 cursor-pointer text-orange-700 font-semibold rounded-lg hover:bg-orange-200 transition-colors text-sm">
                        <EditIcon />
                        <span>Edit</span>
                    </button>
                )}
            </div>
            <div className="px-6 py-5">
                {children}
            </div>
            {isEditing && footer && (
                <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default InfoCard;
