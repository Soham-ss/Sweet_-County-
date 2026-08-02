import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import CartPage from './components/CartPage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage'; 
import AdminDashboard from './pages/AdminDashboard'; 

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Login />} />

                <Route path="/store" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />

                <Route path="/cart" element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                } />

                <Route path="/payment" element={
                  <ProtectedRoute>
                    <PaymentPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />

                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;