import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import RoutesPage from "./pages/RoutesPage";
import LocationsPage from "./pages/LocationsPage";
import TransportationsPage from "./pages/TransportationsPage";
import Header from "./components/Header";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Header />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Dashboard />}>
                            <Route path="routes" element={<RoutesPage />} />
                            <Route path="locations" element={<LocationsPage />} />
                            <Route path="transportations" element={<TransportationsPage />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
