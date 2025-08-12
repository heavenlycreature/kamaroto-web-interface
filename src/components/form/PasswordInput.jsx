import React, { useState } from 'react';
import { InputField } from './FormElements'; // Asumsi diekspor dari file yang sama dengan InputField

// Komponen kecil untuk menampilkan syarat password
const PasswordRequirement = ({ isValid, text }) => (
    <p className={`text-sm ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
        {isValid ? '✓' : '•'} {text}
    </p>
);

const PasswordInput = ({ 
    label, 
    id, 
    name, 
    value, 
    onChange, 
    placeholder, 
    required = true, 
    passwordValidation 
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <div className="relative">
                <InputField
                    icon="https://icongr.am/feather/lock.svg?size=20&color=9ca3af"
                    label={label}
                    id={id}
                    name={name}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 top-7 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                    {showPassword ? (
                        <img src="https://icongr.am/feather/eye-off.svg?size=20&color=currentColor" alt="Sembunyikan" />
                    ) : (
                        <img src="https://icongr.am/feather/eye.svg?size=20&color=currentColor" alt="Tampilkan" />
                    )}
                </button>
            </div>
            {passwordValidation && (
                <div className="grid grid-cols-2 gap-x-4 mt-2 pl-2">
                    <PasswordRequirement isValid={passwordValidation.minLength} text="Min. 8 karakter" />
                    <PasswordRequirement isValid={passwordValidation.hasUpper} text="1 Huruf Kapital" />
                    <PasswordRequirement isValid={passwordValidation.hasNumber} text="1 Angka" />
                    <PasswordRequirement isValid={passwordValidation.hasSymbol} text="1 Simbol" />
                </div>
            )}
        </div>
    );
};

export default PasswordInput;