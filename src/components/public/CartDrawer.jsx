import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from '../shared/Button';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
    const navigate = useNavigate();
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal,
        isCartOpen,
        setIsCartOpen
    } = useCart();

    if (!isCartOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'white',
            boxShadow: '-4px 0 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 0.3s ease-out'
        }}>
            <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--color-primary)',
                color: 'white'
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Seu Carrinho</h2>
                <button onClick={() => setIsCartOpen(false)} style={{ color: 'white' }}>
                    <X size={24} />
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                {cartItems.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
                        Seu carrinho está vazio.
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {cartItems.map(item => (
                            <div key={item.id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #f5f5f5', paddingBottom: '1rem' }}>
                                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.name}</h4>
                                    <p style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '4px', background: '#eee', borderRadius: '4px' }}><Minus size={14} /></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '4px', background: '#eee', borderRadius: '4px' }}><Plus size={14} /></button>
                                        <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: 'auto', color: '#ef4444' }}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid #eee', backgroundColor: '#f9fafb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
                    <span>Total:</span>
                    <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <Button
                    variant="primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={cartItems.length === 0}
                    onClick={() => {
                        setIsCartOpen(false);
                        navigate('/checkout');
                    }}
                >
                    Finalizar Pedido
                </Button>
            </div>
        </div>
    );
}
