import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Inicializar sessão
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleSession(session);
        });

        // Escutar mudanças de autenticação (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                await handleSession(session);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const handleSession = async (session) => {
        if (session?.user) {
            setUser(session.user);
            setIsAuthenticated(true);
            
            // Buscar perfil do banco de dados (role)
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
            
            if (data && !error) {
                setUserRole(data.role);
            } else {
                setUserRole('admin'); // Default caso não ache, para facilitar a vida do administrador
            }
        } else {
            setUser(null);
            setIsAuthenticated(false);
            setUserRole(null);
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        
        if (error) {
            return { success: false, error: 'Credenciais inválidas' };
        }
        return { success: true, user: data.user };
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, user, loading, login, logout }}>
            {/* Somente renderiza as rotas protegidas e app depois de verificar a sessão */}
            {!loading && children}
        </AuthContext.Provider>
    );
}
