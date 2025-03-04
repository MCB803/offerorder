import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // user info: { username, role, token }
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axiosInstance.post("/api/auth/login", credentials);
            const { token, role, username } = response.data;
            const userData = { token, role, username };

            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("jwtToken", token);

            navigate(role === "ADMIN" ? "/locations" : "/routes", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("jwtToken");
        navigate("/login", { replace: true });
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, error, setError }}>
            {children}
        </AuthContext.Provider>
    );
};
