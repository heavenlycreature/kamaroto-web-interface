import React from 'react';

const DataTable = ({
    tabs,
    activeTab,
    onTabChange,
    searchTerm,
    onSearchChange,
    tableHeaders,
    data,
    loading,
    error,
    renderRow, // <-- Ini adalah "render prop" yang membuat komponen ini sangat dinamis
    paginationContent
}) => {
    return (
        <>
            {/* --- Bagian Kontrol: Tabs dan Search --- */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {tabs.map(tab => (
                            <button 
                                key={tab.key}
                                onClick={() => onTabChange(tab.key)} 
                                className={`cursor-pointer px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tab.key ? 'bg-orange-500 text-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <input 
                            type="text"
                            placeholder="Cari..."
                            value={searchTerm}
                            onChange={onSearchChange}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Bagian Tabel Data --- */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {loading && <p className="p-6 text-center text-slate-500">Memuat data...</p>}
                {error && <p className="p-6 text-center text-red-500">{error}</p>}
                {!loading && !error && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        {tableHeaders.map(header => (
                                            <th key={header} scope="col" className={`px-6 py-3 ${header.toLowerCase() === 'aksi' ? 'text-center' : ''}`}>
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(item => renderRow(item))}
                                </tbody>
                            </table>
                        </div>
                        {data.length === 0 && <p className="p-6 text-center text-slate-500">Tidak ada data ditemukan.</p>}
                    </>
                )}
                {paginationContent && (
                    <div className="p-4 border-t border-slate-200 text-sm text-slate-600">
                        {paginationContent}
                    </div>
                )}
            </div>
        </>
    );
};

export default DataTable;