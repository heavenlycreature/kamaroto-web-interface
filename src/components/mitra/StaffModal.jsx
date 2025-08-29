// src/components/mitra/MechanicModal.jsx
// Modal untuk menambah dan mengedit data mekanik.

import React, { useState, useEffect, useRef } from 'react';

const StaffModal = ({ isOpen, onClose, onSave, mechanic }) => {
    const [name, setName] = useState('');
    const [status, setStatus] = useState('AVAILABLE');
    const [skillset, setSkillset] = useState('');
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const fileInputRef = useRef(null);

    const isEditMode = Boolean(mechanic);

    useEffect(() => {
        if (isOpen && isEditMode) {
            setName(mechanic.name || '');
            setStatus(mechanic.status || 'AVAILABLE');
            setSkillset(mechanic.skillset || '');
            setPhotoPreview(mechanic.photo ? `http://localhost:3000${mechanic.photo}` : '');
        } else if (isOpen && !isEditMode) {
            // Reset form for adding new mechanic
            setName('');
            setStatus('AVAILABLE');
            setSkillset('');
            setPhoto(null);
            setPhotoPreview('');
        }
    }, [isOpen, mechanic, isEditMode]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('status', status);
        formData.append('skillset', skillset);
        if (photo) {
            formData.append('photo', photo);
        }
        onSave(formData, mechanic?.id);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 max-w-lg w-full">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">{isEditMode ? 'Edit Mekanik' : 'Tambah Mekanik Baru'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                            <div onClick={() => fileInputRef.current.click()} className="w-24 h-24 bg-slate-100 rounded-full flex-shrink-0 cursor-pointer flex items-center justify-center overflow-hidden">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-slate-400 text-xs text-center">Pilih Foto</span>
                                )}
                            </div>
                            <div className="w-full">
                                <label htmlFor="name" className="block text-sm font-medium text-slate-600">Nama Lengkap</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-slate-600">Status</label>
                            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg">
                                <option value="AVAILABLE">Available</option>
                                <option value="ON_LEAVE">On Leave</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="skillset" className="block text-sm font-medium text-slate-600">Keahlian</label>
                            <textarea id="skillset" value={skillset} onChange={(e) => setSkillset(e.target.value)} placeholder="Contoh: Spesialis Rem, Servis Rutin" rows="3" className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-lg"></textarea>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-8">
                        <button type="button" onClick={onClose} className="px-5 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300">Batal</button>
                        <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffModal;
