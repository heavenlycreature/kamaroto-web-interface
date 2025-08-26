// hooks/useAddressDropdown.jsx

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const wilayahApi = axios.create({ baseURL: 'https://api.kirimin.id' });

const toList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
};

const toCityDisplay = (row) => {
    if (row?.city_type === 'KAB') return `Kab. ${row.value}`;
    if (row?.city_type === 'KOTA') return `Kota ${row.value}`;
    if (typeof row?.value === 'string') {
        const v = row.value.trim();
        if (/^KAB(\.|UPATEN)?\b/i.test(v)) return v.replace(/^KAB(\.|UPATEN)?\b/i, 'Kab.');
        if (/^KOTA\b/i.test(v)) return v.replace(/^KOTA\b/i, 'Kota');
        return v;
    }
    return row?.value ?? '';
};

export const useAddressDropdown = (selectedAddress, setSelectedAddress) => {
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);
    const [zipcodes, setZipcodes] = useState([]);

    // Gunakan ref untuk mencegah re-trigger effect yang tidak perlu saat nama disinkronkan
    const isInitialMount = useRef(true);

    // 1) Fetch Provinces
    useEffect(() => {
        wilayahApi.get('/api/province')
            .then(res => setProvinces(toList(res.data).map(p => ({ id: String(p.id), value: p.value })) ))
            .catch(err => { console.error('Gagal mengambil data provinsi:', err); setProvinces([]); });
    }, []);

    // 2) Fetch Regencies based on provinceCode
    useEffect(() => {
        if (!selectedAddress.provinceCode) {
            setRegencies([]);
            return;
        }
        wilayahApi.get(`/api/city/${selectedAddress.provinceCode}`)
             .then(res => setRegencies(
                toList(res.data).map(r => ({
                    id: String(r.id),
                    value: r.value,
                    city_type: r.city_type,
                    display: toCityDisplay(r)
                }))
                ))
            .catch(err => { console.error('Gagal mengambil data kabupaten/kota:', err); setRegencies([]); });
    }, [selectedAddress.provinceCode]);

    // 3) Fetch Districts based on regencyCode
    useEffect(() => {
        if (!selectedAddress.regencyCode) {
            setDistricts([]);
            return;
        }
        wilayahApi.get(`/api/sub_district/${selectedAddress.regencyCode}`)
             .then(res => setDistricts(
            toList(res.data).map(d => ({ ...d, id: String(d.id) }))
            ))
            .catch(err => { console.error('Gagal mengambil data kecamatan:', err); setDistricts([]); });
    }, [selectedAddress.regencyCode]);

    // 4) Fetch Villages based on districtCode
    useEffect(() => {
        if (!selectedAddress.districtCode) {
            setVillages([]);
            return;
        }
        wilayahApi.get(`/api/village/${selectedAddress.districtCode}`)
             .then(res => setVillages(
            toList(res.data).map(v => ({ ...v, id: String(v.id) }))
            ))
            .catch(err => { console.error('Gagal mengambil data kelurahan/desa:', err); setVillages([]); });
    }, [selectedAddress.districtCode]);

    useEffect(() => {

        const syncAddressNames = () => {
            let needsUpdate = false;
            const updatedAddress = { ...selectedAddress };

            if (regencies.length > 0 && selectedAddress.regencyCode) {
                const selectedRegency = regencies.find(r => String(r.id) === String(selectedAddress.regencyCode));
                if (selectedRegency && selectedRegency.display !== updatedAddress.regencyName) {
                    updatedAddress.regencyName = selectedRegency.display;
                    needsUpdate = true;
                }
            }

            if (districts.length > 0 && selectedAddress.districtCode) {
                const selectedDistrict = districts.find(d => String(d.id) === String(selectedAddress.districtCode));
                if (selectedDistrict && selectedDistrict.value !== updatedAddress.districtName) {
                    updatedAddress.districtName = selectedDistrict.value;
                    needsUpdate = true;
                }
                // Update juga kode pos setelah district dimuat
                if (selectedDistrict?.postal_code && Array.isArray(selectedDistrict.postal_code)) {
                     setZipcodes(
                       (selectedDistrict.postal_code || []).map(pc => ({
                         id: String(pc.value),   // jadikan string
                         value: String(pc.value) // jadikan string
                       }))
                     );
                } else {
                    setZipcodes([]);
                }
            }

            if (villages.length > 0 && selectedAddress.villageCode) {
                const selectedVillage = villages.find(v => String(v.id) === String(selectedAddress.villageCode));
                if (selectedVillage && selectedVillage.value !== updatedAddress.villageName) {
                    updatedAddress.villageName = selectedVillage.value;
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                setSelectedAddress(updatedAddress);
            }
        };

        // Hanya jalankan sinkronisasi setelah mount awal untuk menghindari loop
        if (!isInitialMount.current) {
            syncAddressNames();
        } else {
            // Setelah mount pertama, set isInitialMount ke false
            isInitialMount.current = false;
        }

    }, [regencies, districts, villages, selectedAddress, setSelectedAddress]);


    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        const { code, name: n } = JSON.parse(value);
        
        setSelectedAddress(cur => {
            const s = { ...cur };
            if (name === 'province') {
                s.provinceCode = code; s.provinceName = n;
                s.regencyCode = ''; s.regencyName = '';
                s.districtCode = ''; s.districtName = '';
                s.villageCode = '';  s.villageName  = '';
                s.postalCode  = '';
                setRegencies([]); setDistricts([]); setVillages([]); setZipcodes([]);
            } else if (name === 'regency') {
                s.regencyCode = code; s.regencyName = n;
                s.districtCode = ''; s.districtName = '';
                s.villageCode = '';  s.villageName  = '';
                s.postalCode  = '';
                setDistricts([]); setVillages([]); setZipcodes([]);
            } else if (name === 'district') {
                s.districtCode = code; s.districtName = n;
                s.villageCode = '';  s.villageName  = '';
                s.postalCode  = '';
                setVillages([]);
            } else if (name === 'village') {
                s.villageCode = code; s.villageName = n;
            } else if (name === 'postalCode') {
                s.postalCode = n;
            }
            return s;
        });
    };

    return {
        addressOptions: { provinces, regencies, districts, villages, zipcodes },
        handleAddressChange,
    };
};