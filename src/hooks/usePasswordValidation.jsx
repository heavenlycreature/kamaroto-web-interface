import { useState } from 'react';

export const usePasswordValidation = () => {
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasUpper: false,
        hasNumber: false,
        hasSymbol: false,
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Fungsi untuk memeriksa kekuatan password
    const validatePasswordStrength = (password) => {
        setPasswordValidation({
            minLength: password.length >= 8,
            hasUpper: /[A-Z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSymbol: /[^A-Za-z0-9]/.test(password),
        });
    };
    
    // Handler khusus untuk input konfirmasi password
    const handleConfirmPasswordChange = (e, mainPassword) => {
        const { value } = e.target;
        setConfirmPassword(value);
        if (mainPassword && value !== mainPassword) {
            setPasswordError('Konfirmasi password tidak cocok.');
        } else {
            setPasswordError('');
        }
    };

    return {
        passwordValidation,
        confirmPassword,
        passwordError,
        setPasswordError, // Kita ekspor juga setter-nya
        validatePasswordStrength,
        handleConfirmPasswordChange,
    };
};