import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('cda_auth_token') === 'simulated-token';
    });

    const login = (username, password) => {
        // Simulated credential check
        if (username === 'CasaDosAssados' && password === 'Assados@2k26') {
            localStorage.setItem('cda_auth_token', 'simulated-token');
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('cda_auth_token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
