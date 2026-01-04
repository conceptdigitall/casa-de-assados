import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Settings, LogOut, ClipboardList, PlusCircle, Bike } from 'lucide-react';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: <PlusCircle size={20} />, label: 'Novo Pedido', path: '/admin/pos' },
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
        { icon: <ShoppingCart size={20} />, label: 'Pedidos', path: '/admin/orders' },
        { icon: <Package size={20} />, label: 'Produtos', path: '/admin/products' },
        { icon: <ClipboardList size={20} />, label: 'Estoque', path: '/admin/inventory' },
        { icon: <Bike size={20} />, label: 'Motoboys', path: '/admin/couriers' },
        { icon: <Settings size={20} />, label: 'Configurações', path: '/admin/settings' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: '#1f2937',
                color: 'white',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={logo} alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', lineHeight: '1' }}>Admin</h1>
                        <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Casa dos Assados</span>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '1rem' }}>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link to={item.path} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    transition: 'background-color 0.2s',
                                    backgroundColor: isActive(item.path) ? 'var(--color-primary)' : 'transparent',
                                    color: isActive(item.path) ? 'white' : '#d1d5db',
                                    textDecoration: 'none'
                                }}>
                                    {item.icon}
                                    <span style={{ fontWeight: 500 }}>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid #374151' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            width: '100%',
                            padding: '0.75rem 1rem',
                            color: '#ef4444',
                            cursor: 'pointer'
                        }}>
                        <LogOut size={20} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
}
