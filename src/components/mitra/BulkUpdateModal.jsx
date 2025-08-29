import { useState } from "react";

const BulkUpdateModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString().split('T')[0],
        daysOfWeek: [1, 2, 3, 4, 5, 6, 7], // Senin-Jumat
        startTime: 8,
        endTime: 17,
        capacity: 1,
        mechanicsAvailable: 1,
    });

    if (!isOpen) return null;

    const handleDayToggle = (dayIndex) => {
        setFormData(prev => {
            const newDays = prev.daysOfWeek.includes(dayIndex)
                ? prev.daysOfWeek.filter(d => d !== dayIndex)
                : [...prev.daysOfWeek, dayIndex];
            return { ...prev, daysOfWeek: newDays };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || value }));
    };

    const handleSaveClick = () => {
        // Validasi sederhana
        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            alert("Tanggal akhir tidak boleh sebelum tanggal mulai.");
            return;
        }
        if (formData.endTime <= formData.startTime) {
            alert("Jam selesai harus setelah jam mulai.");
            return;
        }
        onSave(formData);
    };

    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg space-y-4">
                <h2 className="text-xl font-bold text-slate-800">Update Jadwal Massal</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Dari Tanggal</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full mt-1 border p-2 rounded-lg" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Sampai Tanggal</label>
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full mt-1 border p-2 rounded-lg" />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium">Pilih Hari</label>
                    <div className="flex space-x-2 mt-1">
                        {days.map((day, index) => (
                            <button key={day} onClick={() => handleDayToggle(index)} className={`px-3 py-1.5 rounded-full text-sm ${formData.daysOfWeek.includes(index) ? 'bg-orange-500 text-white' : 'bg-slate-200'}`}>
                                {day}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Dari Jam</label>
                        <select name="startTime" value={formData.startTime} onChange={handleChange} className="w-full mt-1 border p-2 rounded-lg">
                            {[...Array(24).keys()].map(h => <option key={h} value={h}>{`${h.toString().padStart(2, '0')}:00`}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Sampai Jam</label>
                        <select name="endTime" value={formData.endTime} onChange={handleChange} className="w-full mt-1 border p-2 rounded-lg">
                            {[...Array(24).keys()].map(h => <option key={h} value={h}>{`${h.toString().padStart(2, '0')}:00`}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Kapasitas per Jam</label>
                        <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="0" className="w-full mt-1 border p-2 rounded-lg" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Mekanik Tersedia</label>
                        <input type="number" name="mechanicsAvailable" value={formData.mechanicsAvailable} onChange={handleChange} min="0" className="w-full mt-1 border p-2 rounded-lg" />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-lg">Batal</button>
                    <button onClick={handleSaveClick} className="px-4 py-2 bg-orange-500 text-white rounded-lg">Simpan Jadwal</button>
                </div>
            </div>
        </div>
    );
};

export default BulkUpdateModal;