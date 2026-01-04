import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';

export default function POSPage() {
    const { products, addOrder } = useStore();
    const [cart, setCart] = useState([]);
    const [customer, setCustomer] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('money');
    const [orderType, setOrderType] = useState('pickup');
    const [address, setAddress] = useState('');

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(i => {
            if (i.id === id) {
                return { ...i, quantity: Math.max(1, i.quantity + delta) };
            }
            return i;
        }));
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleFinalize = () => {
        if (cart.length === 0) return;

        const order = {
            customer: {
                name: customer || 'Cliente Balcão',
                phone: 'Presencial',
                address: orderType === 'delivery' ? address : 'Retirada'
            },
            items: cart,
            total: total,
            status: 'Pendente', // Start as Pendente so it goes through the flow
            payment: {
                method: paymentMethod,
                change: 0
            },
            type: orderType,
            observation: 'Pedido Balcão/Telefone'
        };

        addOrder(order);
        alert('Pedido Realizado com Sucesso!');
        setCart([]);
        setCustomer('');
        setOrderType('pickup');
        setAddress('');
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', height: 'calc(100vh - 4rem)' }}>
            {/* Product Selection */}
            <div style={{ overflowY: 'auto', paddingRight: '1rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>Novo Pedido (PDV)</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {products.map(product => (
                        <div
                            key={product.id}
                            onClick={() => product.stock > 0 && addToCart(product)}
                            style={{
                                backgroundColor: 'white',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                                border: '1px solid #e5e7eb',
                                opacity: product.stock > 0 ? 1 : 0.6,
                                position: 'relative'
                            }}
                        >
                            <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{product.name}</h3>
                            <p style={{ color: '#dc2626', fontWeight: 'bold' }}>R$ {product.price.toFixed(2)}</p>
                            {product.stock <= 0 && (
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.7)', fontWeight: 'bold', color: 'red' }}>
                                    ESGOTADO
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart Summary */}
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 15px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShoppingCart size={20} /> Carrinho Atual
                </h2>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                    {cart.length === 0 ? (
                        <p style={{ color: '#9ca3af', textAlign: 'center' }}>Nenhum item adicionado</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                    <div>
                                        <div style={{ fontWeight: '500' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            {item.quantity}x R$ {item.price.toFixed(2)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '0.25rem', backgroundColor: '#f3f4f6', borderRadius: '0.25rem' }}><Minus size={14} /></button>
                                        <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '0.25rem', backgroundColor: '#f3f4f6', borderRadius: '0.25rem' }}><Plus size={14} /></button>
                                        <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', marginLeft: '0.5rem' }}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ borderTop: '2px solid #f3f4f6', paddingTop: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Cliente (Opcional)</label>
                        <input
                            type="text"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            placeholder="Nome do cliente"
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Pagamento</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                        >
                            <option value="money">Dinheiro</option>
                            <option value="credit">Cartão Crédito</option>
                            <option value="debit">Cartão Débito</option>
                            <option value="pix">Pix</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Tipo de Pedido</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="orderType"
                                    value="pickup"
                                    checked={orderType === 'pickup'}
                                    onChange={(e) => setOrderType(e.target.value)}
                                />
                                Retirada
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="orderType"
                                    value="delivery"
                                    checked={orderType === 'delivery'}
                                    onChange={(e) => setOrderType(e.target.value)}
                                />
                                Entrega
                            </label>
                        </div>
                    </div>

                    {orderType === 'delivery' && (
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Endereço de Entrega</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Rua, Número, Bairro..."
                                rows={2}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        <span>Total</span>
                        <span>R$ {total.toFixed(2)}</span>
                    </div>

                    <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleFinalize} disabled={cart.length === 0}>
                        Finalizar Venda
                    </Button>
                </div>
            </div>
        </div>
    );
}
