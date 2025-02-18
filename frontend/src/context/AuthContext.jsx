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
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axiosInstance.post("/api/auth/login", credentials);
            const { token, role, username } = response.data;
            const userData = { token, role, username };

            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("jwtToken", token);

            navigate(role === "ADMIN" ? "/locations" : "/routes", { replace: true });
        } catch (error) {
            console.error("Login failed", error);
        }
    };


    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};