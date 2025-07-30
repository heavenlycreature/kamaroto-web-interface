import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Register from './pages/auth/Register';
import RegisterCaptain from './pages/auth/RegisterCaptain';
import RegisterMitra from './pages/auth/RegisterMitra';
import Login from './pages/auth/Login';
import CaptainProfile from './pages/captain/CaptainProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import MembershipPage from './pages/admin/MembershipPage';
import ApprovalPage from './pages/admin/ApprovalPage';

function App() {
	return (
		<Router>
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<main className="flex-grow">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />

						<Route path="/register" element={<Register />} />
						<Route path="/register/captain" element={<RegisterCaptain />} />
						<Route path="/register/mitra" element={<RegisterMitra />} />
						<Route path="/login" element={<Login />} />

						<Route path="/admin/dashboard" element={<AdminDashboard />} />
						<Route path="/admin/membership" element={<MembershipPage />} />
						<Route path="/admin/approval" element={<ApprovalPage />} />

						<Route path="/captain/profile" element={<CaptainProfile />} />

						<Route path="*" element={<NotFound />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	);
}

export default App;