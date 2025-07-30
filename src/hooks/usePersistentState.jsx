import { useState, useEffect } from 'react';

// Hook ini adalah pengganti useState yang dilengkapi dengan localStorage
function usePersistentState(key, initialValue) {
    // 1. Gunakan useState, tapi inisialisasi nilainya dari localStorage
    const [state, setState] = useState(() => {
        try {
            const storedValue = localStorage.getItem(key);
            // Jika ada nilai tersimpan, gunakan itu. Jika tidak, gunakan nilai awal.
            return storedValue ? JSON.parse(storedValue) : initialValue;
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return initialValue;
        }
    });

    // 2. Gunakan useEffect untuk menyimpan state ke localStorage setiap kali nilainya berubah
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error("Error writing to localStorage", error);
        }
    }, [key, state]); // Efek ini akan berjalan setiap kali 'key' atau 'state' berubah

    // 3. Kembalikan state dan fungsi setter-nya, sama seperti useState
    return [state, setState];
}

export default usePersistentState;