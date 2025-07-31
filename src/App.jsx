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
import GuestRoute from './components/auth/GuestRoute';
// import PendingApprovalPage from './pages/auth/PendingApprovalPage';
import StatusPage from './pages/StatusPage';

function App() {
return (
    <Router>
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />

                    <Route path="/register" element={ <GuestRoute><Register /></GuestRoute> } />
                    <Route path="/register/captain" element={ <GuestRoute><RegisterCaptain /></GuestRoute> } />
                    <Route path="/register/mitra" element={ <GuestRoute><RegisterMitra /></GuestRoute> } />
                    <Route path="/login" element={ <GuestRoute><Login /></GuestRoute> } />
                    {/* <Route path="/rejected" element={ <PendingApprovalPage />}></Route> */}

                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/membership" element={<MembershipPage />} />
                    <Route path="/status" element={<StatusPage />} />

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