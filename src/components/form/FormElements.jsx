import React from 'react';

export const InputField = ({ icon, label, id, value, onChange, type = 'text', placeholder, required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <img src={icon} alt="input icon" className="w-5 h-5 text-gray-400" />
            </div>
            <input
                type={type} id={id} name={id} value={value} onChange={onChange}
                placeholder={placeholder} required={required}
                className="block w-full pl-10 pr-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
        </div>
    </div>
);

export const SelectField = ({ id, name, value, onChange, disabled, required, children }) => (
    <select
        id={id} name={name} value={value} onChange={onChange}
        disabled={disabled} required={required}
        className="block w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all disabled:bg-gray-200"
    >
        {children}
    </select>
);