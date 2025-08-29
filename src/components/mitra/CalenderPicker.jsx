import { useState } from "react";

const CalendarPicker = ({ selectedDate, onDateChange }) => {
    const [displayDate, setDisplayDate] = useState(selectedDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalisasi untuk perbandingan tanggal saja

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Minggu, 1=Senin, ...
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const handlePrevMonth = () => {
        setDisplayDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setDisplayDate(new Date(year, month + 1, 1));
    };
    
    const handleDateClick = (day) => {
        const newDate = new Date(year, month, day);
        onDateChange(newDate); // Kirim tanggal baru ke parent component
    };
    
    // Buat array kosong untuk padding di awal bulan
    const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`pad-${i}`}></div>);

    const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
        const dayNumber = i + 1;
        const date = new Date(year, month, dayNumber);
        
        const isSelected = selectedDate.getTime() === date.getTime();
        const isToday = today.getTime() === date.getTime();
        
        let buttonClass = "w-9 h-9 flex items-center justify-center rounded-full hover:bg-orange-100 transition-colors";
        if (isSelected) {
            buttonClass += " bg-orange-500 text-white font-bold";
        } else if (isToday) {
            buttonClass += " ring-2 ring-orange-300";
        }

        return (
            <button key={dayNumber} onClick={() => handleDateClick(dayNumber)} className={buttonClass}>
                {dayNumber}
            </button>
        );
    });

    return (
        <div className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100">&lt;</button>
                <div className="text-center font-semibold text-slate-800">
                    {displayDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                </div>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => <span key={day}>{day}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {paddingDays}
                {monthDays}
            </div>
        </div>
    );
};

export default CalendarPicker;
