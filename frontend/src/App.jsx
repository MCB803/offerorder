import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RoutesPage from './pages/RoutesPage';
import LocationsPage from './pages/LocationsPage';
import TransportationsPage from './pages/TransportationsPage';
import Header from './components/Header';

function App() {
    const token = localStorage.getItem('jwtToken');

    return (
        <Router>
            <AuthProvider>
                <Header/>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} >
                        <Route path="routes" element={<RoutesPage />} />
                        <Route path="locations" element={<LocationsPage />} />
                        <Route path="transportations" element={<TransportationsPage />} />
                        <Route path="" element={<Navigate to="/routes" />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
