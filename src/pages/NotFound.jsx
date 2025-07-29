import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div className="container mx-auto px-6 py-16 md:py-24 text-center">
			<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
			<p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
				The page you are looking for does not exist.
			</p>
			<Link to="/" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
				Go to Homepage
			</Link>
		</div>
	);
};

export default NotFound;
