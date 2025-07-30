import { useState, useEffect } from 'react';
import api from '../api/api';

// Hook sekarang menerima state dan setter-nya sebagai argumen
export const useAddressDropdown = (selectedAddress, setSelectedAddress) => {
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);
    
    // Kita sekarang menggunakan state dari komponen

    // Fetching Logic (sekarang bergantung pada `selectedAddress` dari argumen)
    useEffect(() => { api.get('/address').then(res => setProvinces(res.data)).catch(err => console.error(err)); }, []);
    useEffect(() => { if (selectedAddress.province) api.get(`/address?province=${selectedAddress.province}`).then(res => setCities(res.data)); }, [selectedAddress.province]);
    useEffect(() => { if (selectedAddress.city) api.get(`/address?province=${selectedAddress.province}&city=${selectedAddress.city}`).then(res => setDistricts(res.data)); }, [selectedAddress.city]);
    useEffect(() => { if (selectedAddress.district) api.get(`/address?province=${selectedAddress.province}&city=${selectedAddress.city}&district=${selectedAddress.district}`).then(res => setSubdistricts(res.data)); }, [selectedAddress.district]);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        // Gunakan setSelectedAddress dari argumen untuk memperbarui state komponen
        setSelectedAddress(currentState => {
            const newState = { ...currentState, [name]: value };
            if (name === 'province') {
                newState.city = ''; newState.district = ''; newState.subdistrict = '';
                setCities([]); setDistricts([]); setSubdistricts([]);
            } else if (name === 'city') {
                newState.district = ''; newState.subdistrict = '';
                setDistricts([]); setSubdistricts([]);
            } else if (name === 'district') {
                newState.subdistrict = '';
                setSubdistricts([]);
            }
            return newState;
        });
    };

    // Kembalikan hanya options dan handler
    return {
        addressOptions: { provinces, cities, districts, subdistricts },
        handleAddressChange,
    };
};