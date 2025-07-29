import React from 'react';
import logo from '../assets/images/kamaroto.png';

const features = [
    {
        icon: "https://icongr.am/feather/target.svg?size=50&color=f97b02",
        title: "Layanan Cepat & Terintegrasi",
        description: "Semua kebutuhan otomotif Anda, dari servis hingga aksesori, terhubung dalam satu aplikasi."
    },
    {
        icon: "https://icongr.am/feather/map-pin.svg?size=50&color=f97b02",
        title: "Jangkauan Hiperlokal",
        description: "Kami hadir di setiap radius 5KM, memastikan layanan kami selalu dekat dengan Anda."
    },
    {
        icon: "https://icongr.am/fontawesome/handshake-o.svg?size=50&color=f97b02",
        title: "Platform Terpercaya",
        description: "Menghubungkan Anda dengan mitra dan UMKM otomotif lokal yang telah terverifikasi."
    }
];

// Data untuk nilai-nilai perusahaan (Credo)
const credoItems = ['Passion', 'Commitment', 'Fast', 'Easy', 'Lifestyle'];

const About = () => {
    return (
        <div className="bg-white overflow-x-hidden">
            {/* ===== Hero Section ===== */}
            <section className="relative h-[70vh] flex items-center justify-center text-center text-white px-6">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
                ></div>
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2100&auto=format&fit=crop')" }}
                ></div>
                <div className="relative z-10 animate-fade-in-up px-30">
                    <img src={logo} alt="KamarOTO Logo" className="h-30 w-auto mx-auto mb-6" />
                </div>
            </section>

            {/* ===== Main Content ===== */}
            <main className="py-24 md:py-32">
                <div className="container mx-auto px-6">

                    {/* --- Bagian "Kenapa KamarOTO" --- */}
                    <section className="mb-24 md:mb-34">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">KamarOTO</h2>
                            <p className="text-lg text-gray-600 mt-4">
                                KamarOTO adalah platform digital otomotif yang mengintegrasikan berbagai kebutuhan dan layanan pengguna kendaraan dalam satu aplikasi. Kami hadir untuk menjadi solusi utama ekosistem otomotif di Indonesia. KamarOTO hadir di setiap radius 5KM untuk menyediakan layanan dan kebutuhan konsumsi pelanggan tanpa hambatan jarak dan waktu.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 border border-transparent flex items-center space-x-5">
                                    <div className="flex-shrink-0">
                                        <img src={feature.icon} alt="Feature Icon" className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="grid lg:grid-cols-2 gap-16 items-center mb-24 md:mb-32">
                        <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop"
                                alt="Tim KamarOTO"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="lg:pl-8">
                            <div className="mb-10">
                                <h3 className="text-3xl font-bold text-gray-900 mb-3">Visi Kami</h3>
                                <p className="text-xl text-gray-600 leading-relaxed italic">
                                    "Menjadi pusat ekosistem digital otomotif terlengkap dan terpercaya di Indonesia."
                                </p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-5">Misi Kami</h3>
                                <ul className="space-y-4 text-lg text-gray-700">
                                    <li className="flex items-start"><span className="text-orange-500 font-bold mr-3 mt-1">&#10003;</span><span>Mendigitalkan UMKM dan pelaku industri otomotif lokal.</span></li>
                                    <li className="flex items-start"><span className="text-orange-500 font-bold mr-3 mt-1">&#10003;</span><span>Menyediakan platform yang aman dan mudah diakses.</span></li>
                                    <li className="flex items-start"><span className="text-orange-500 font-bold mr-3 mt-1">&#10003;</span><span>Memberikan pengalaman terbaik bagi mitra dan pengguna.</span></li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="relative py-20 px-6 rounded-2xl shadow-sm overflow-hidden bg-orange-100">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-8 text-gray-900 tracking-widest">OUR CREDO</h3>
                            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
                                {credoItems.map((item, index) => (
                                    <React.Fragment key={item}>
                                        <p className="text-xl md:text-xl font-semibold text-gray-900">{item}</p>
                                        {index < credoItems.length - 1 && <span className="text-orange-500 text-3xl hidden md:block">•</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
};

export default About;
