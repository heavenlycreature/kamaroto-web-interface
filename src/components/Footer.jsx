import React from 'react';
import logoKamaroto from '../assets/images/kamaroto.png';

const Footer = () => {
	return (
		<footer className="bg-[#191919] text-white border-t-4 border-orange-500">
			<div className="max-w-7xl mx-auto px-6 py-8">
				<div className="flex flex-col md:flex-row justify-between items-start gap-y-12">
					{/* Powered By */}
					<div className="md:w-1/3 md:text-left text-center">
						<h4 className="text-xl font-bold mb-4">Powered By</h4>
						<img src={logoKamaroto} alt="Logo KamarOTO" className="h-14 w-auto inline-block md:inline" />
					</div>

					{/* Hubungi Kami */}
					<div className="md:w-1/3 text-center">
						<h4 className="text-xl font-bold mb-4">Hubungi Kami</h4>
						<ul className="space-y-2 text-gray-400 text-sm">
							<li className="flex justify-center md:justify-center items-center gap-2">
								<img src="https://icongr.am/feather/phone.svg?size=20&color=abafc0" alt="Phone" />
								<span>+62 123 4567 8901</span>
							</li>
							<li className="flex justify-center md:justify-center items-center gap-2">
								<img src="https://icongr.am/feather/mail.svg?size=20&color=abafc0" alt="Mail" />
								<span>email@email.com</span>
							</li>
						</ul>
					</div>

					{/* Tautan */}
						<div className="md:w-1/3">
							<h4 className="text-xl font-bold mb-4">Tautan</h4>
							<ul className="space-y-2 text-gray-400 text-sm">
								<li>
									<a href="/gabung" className="hover:text-white transition-colors">Gabung</a>
								</li>
								<li>
									<a href="#" className="hover:text-white transition-colors">Pemberitahuan</a>
								</li>
							</ul>
						</div>
					</div>

				{/* Garis dan copyright */}
				<div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
					&copy; {new Date().getFullYear()} KamarOTO. Semua Hak Cipta Dilindungi.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
