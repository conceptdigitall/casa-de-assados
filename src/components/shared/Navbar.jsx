import React from 'react';
import { ShoppingBag } from 'lucide-react';
import logo from '../../assets/fire_theme.jpg';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
    const { cartCount, setIsCartOpen } = useCart();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: 'rgba(15, 15, 11, 0.95)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.2rem', color: '#F3F4F6' }}>
                <img src={logo} alt="Logo" style={{ height: '45px', borderRadius: '4px' }} />
                <span style={{ fontFamily: 'var(--font-heading)' }}>Casa dos Assados</span>
            </div>
            <div>
                <button
                    style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => setIsCartOpen(true)}
                >
                    <ShoppingBag color="#F3F4F6" size={24} />
                    {cartCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            backgroundColor: '#FF4D00',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid rgba(15, 15, 11, 1)'
                        }}>{cartCount}</span>
                    )}
                </button>
            </div>
        </nav>
    );
}
