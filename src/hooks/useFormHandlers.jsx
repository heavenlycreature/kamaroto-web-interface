import { useState, useEffect } from 'react';

export const useFormHandlers = (initialFormData) => {
    const [formData, setFormData] = useState(initialFormData);
    const [birthDateParts, setBirthDateParts] = useState({ day: "", month: "", year: "" });

    // Efek untuk menggabungkan tanggal lahir
    useEffect(() => {
        const { day, month, year } = birthDateParts;
        if (day && month && year && year.length === 4) {
            setFormData((prev) => ({
                ...prev,
                birth_date: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
            }));
        }
    }, [birthDateParts]);

    // Handler untuk input tanggal lahir yang terpisah
    const handleBirthDateChange = (e) => {
        const { name, value } = e.target;
        const numericValue = value.replace(/[^0-9]/g, '');
        const limits = { day: 2, month: 2, year: 4 };
        const truncatedValue = numericValue.slice(0, limits[name]);
        setBirthDateParts(prev => ({ ...prev, [name]: truncatedValue }));
    };

    // Handler utama untuk sebagian besar input
    const handleInputChange = (e, validationCallback) => {
        const { name, value, type, checked } = e.target;
        
        // Logika untuk field numerik
        const numericFields = { phone: 13, nik: 16, pic_phone: 13, owner_phone: 13, owner_ktp: 16 };
        if (name in numericFields) {
            const numericValue = value.replace(/[^0-9]/g, '').slice(0, numericFields[name]);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }

        // Panggil callback validasi jika ada (misal: untuk password)
        if (validationCallback) {
            validationCallback(value);
        }

        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    return {
        formData,
        setFormData,
        birthDateParts,
        handleInputChange,
        handleBirthDateChange,
    };
};