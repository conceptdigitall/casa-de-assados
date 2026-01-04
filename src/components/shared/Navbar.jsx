import React from 'react';
import { ShoppingBag } from 'lucide-react';
import logo from '../../assets/logo.png';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
    const { cartCount, setIsCartOpen } = useCart();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: 'var(--color-surface)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                <img src={logo} alt="Logo" style={{ height: '40px' }} />
                <span>Casa dos Assados</span>
            </div>
            <div>
                <button
                    style={{ position: 'relative' }}
                    onClick={() => setIsCartOpen(true)}
                >
                    <ShoppingBag color="var(--color-secondary)" />
                    {cartCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid white'
                        }}>{cartCount}</span>
                    )}
                </button>
            </div>
        </nav>
    );
}
