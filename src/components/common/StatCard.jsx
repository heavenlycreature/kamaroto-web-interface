// src/components/common/StatCard.jsx
// Komponen kartu untuk menampilkan data statistik ringkas.

import React from 'react';

const StatCard = ({ icon, title, value, colorClass = 'blue' }) => {
    const colorVariants = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-700' },
        green: { bg: 'bg-green-100', text: 'text-green-700' },
    };

    const selectedColor = colorVariants[colorClass] || colorVariants.blue;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedColor.bg}`}>
                <img src={icon} alt={title} className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-slate-500">{title}</p>
                <p className={`text-2xl font-bold ${selectedColor.text}`}>{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
