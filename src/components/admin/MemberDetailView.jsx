import React from 'react';

// --- Komponen Ikon ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;

// --- Komponen Baris Detail ---
const DetailRow = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-sm font-medium text-slate-500">{label}</dt>
        <dd className="mt-1 text-sm text-slate-900 sm:col-span-2 sm:mt-0">{value || '-'}</dd>
    </div>
);

const MemberDetailView = ({ member, type, onBack, onApprove, onReject, showApprovalActions = false }) => {
    if (!member) return null;

    const profile = type === 'captain' ? member.coProfile : member.mitraProfile;
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    // Menggunakan data dari 'member' sebagai fallback jika 'profile' tidak ada
    const displayName = profile?.name || member.name;

    return (
        <div className="bg-white rounded-2xl shadow-lg">
            <header className="p-6 border-b border-slate-200 flex items-center space-x-4">
                <button onClick={onBack} className="cursor-pointer p-2 rounded-full hover:bg-slate-100 transition-colors">
                    <BackIcon />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Review Formulir {type === 'captain' ? 'Captain' : 'Mitra'}</h2>
                    <p className="text-sm text-slate-500">{displayName}</p>
                </div>
            </header>
            <main className="p-6 overflow-y-auto">
                {/* PERBAIKAN: Tampilkan data dasar jika profil tidak ada (untuk user pending) */}
                {!profile && (
                    <dl className="divide-y divide-slate-200">
                        <DetailRow label="Nama Lengkap" value={member.name} />
                        <DetailRow label="Email" value={member.email} />
                        <DetailRow label="Nomor HP" value={member.phone} />
                        <DetailRow
                            label="Direferensikan Oleh"
                            value={member.referrer ? `${member.referrer.name} (${member.referrer.email})` : 'Pendaftaran Mandiri'}
                        />
                        <DetailRow label="Tanggal Bergabung" value={formatDate(member.created_at)} />
                        <dt className="text-sm font-medium text-slate-400 pt-4">Detail lengkap akan tersedia setelah akun disetujui.</dt>
                    </dl>
                )}

                {/* Tampilkan detail lengkap jika profil ada */}
                {type === 'captain' && profile && (
                    <dl className="divide-y divide-slate-200">
                        <DetailRow
                            label="Direferensikan Oleh"
                            value={member.referrer ? `${member.referrer.name} (${member.referrer.email})` : 'Pendaftaran Mandiri'}
                        />
                        <DetailRow label="Nama Lengkap" value={profile.name} />
                        <DetailRow label="Email" value={profile.email} />
                        <DetailRow label="Nomor HP" value={member.phone} />
                        <DetailRow label="Tempat & Tanggal Lahir" value={`${profile.birth_place || ''}, ${formatDate(profile.birth_date)}`} />
                        <DetailRow label="Jenis Kelamin" value={profile.gender} />
                        <DetailRow label="Alamat" value={`${profile.address_detail}, ${profile.address_village}, ${profile.address_subdistrict}, ${profile.address_city}, ${profile.address_province}`} />
                        <DetailRow label="Pekerjaan" value={profile.job} />
                        <DetailRow label="Status Pernikahan" value={profile.marital_status} />
                        <DetailRow label="Pendidikan" value={profile.education} />
                        <div className="py-3">
                            <dt className="text-sm font-medium text-slate-500 mb-2">Foto Selfie</dt>
                            <dd><img src={`http://localhost:3000${profile.selfie_url}`} alt="Selfie" className="rounded-lg max-w-xs border" /></dd>
                        </div>
                    </dl>
                )}
                {type === 'mitra' && profile && (
                    <dl className="divide-y divide-slate-200">
                        <DetailRow
                            label="Direferensikan Oleh"
                            value={member.referrer ? `${member.referrer.name} (${member.referrer.email})` : 'Pendaftaran Mandiri'}
                        />
                        <DetailRow label="Nama PIC" value={profile.pic_name} />
                        <DetailRow label="Email PIC" value={profile.pic_email} />
                        <DetailRow label="Nomor HP PIC" value={profile.pic_phone} />
                        <DetailRow label="Nama Pemilik" value={profile.owner_name} />
                        <DetailRow label="Jenis Usaha" value={profile.business_type} />
                        <DetailRow label="Nama Badan Usaha" value={profile.business_entity} />
                        <DetailRow label="Alamat Usaha" value={`${profile.owner_address_detail}, ${profile.owner_address_village}, ${profile.owner_address_subdistrict}, ${profile.owner_address_city}, ${profile.owner_address_province}`} />
                    </dl>
                )}
            </main>
            <footer className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
                {showApprovalActions ? (
                    <>
                        <button onClick={() => onReject(member.id)} className="cursor-pointer px-5 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">Reject</button>
                        <button onClick={() => onApprove(member.id)} className="cursor-pointer px-5 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">Approve</button>
                    </>
                ) : (
                    <button onClick={onBack} className="cursor-pointer px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">Tutup</button>
                )}
            </footer>
        </div>
    );
};

export default MemberDetailView;
