import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../shared/Button';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product, onAdd }) {
    const [observation, setObservation] = useState('');

    const { cartItems } = useCart();
    const cartItem = cartItems.find(item => item.id === product.id);
    const currentQty = cartItem ? cartItem.quantity : 0;
    const isMaxReached = currentQty >= product.stock;

    const handleAdd = () => {
        if (product.stock > 0 && !isMaxReached) {
            onAdd(product, observation);
            setObservation(''); // Reset after adding
        }
    };

    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(255, 77, 0, 0.3)' }}
            transition={{ duration: 0.2 }}
            style={{
                backgroundColor: 'rgba(28, 28, 25, 0.95)', // Dark background
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)'
            }}
        >
            <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {product.stock <= 0 && (
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        color: 'white', fontWeight: 'bold', fontSize: '1.2rem'
                    }}>
                        ESGOTADO
                    </div>
                )}
            </div>
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#F3F4F6' }}>{product.name}</h3>
                    <span style={{
                        color: '#FF4D00', // Fire Orange/Red
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                        textShadow: '0 0 10px rgba(255, 77, 0, 0.3)'
                    }}>
                        R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                </div>
                <p style={{ color: '#9CA3AF', marginBottom: '1rem', flex: 1, fontSize: '0.95rem' }}>
                    {product.description}
                </p>

                {/* Observation Field */}
                <div style={{ marginBottom: '1rem' }}>
                    <textarea
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        placeholder="Observação (ex: Ao ponto, sem cebola...)"
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            resize: 'none',
                            minHeight: '60px',
                            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black
                            color: '#F3F4F6',
                        }}
                    />
                </div>

                <Button
                    variant="primary"
                    onClick={handleAdd}
                    disabled={product.stock <= 0 || isMaxReached}
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        opacity: (product.stock > 0 && !isMaxReached) ? 1 : 0.5,
                        cursor: (product.stock > 0 && !isMaxReached) ? 'pointer' : 'not-allowed',
                        backgroundColor: isMaxReached ? '#4B5563' : '#FF4D00',
                        borderColor: isMaxReached ? '#4B5563' : '#FF4D00',
                        boxShadow: (product.stock > 0 && !isMaxReached) ? '0 4px 15px rgba(255, 77, 0, 0.3)' : 'none',
                        color: 'white',
                        fontWeight: '600'
                    }}
                >
                    {product.stock <= 0 ? 'VOLTO LOGO' : (isMaxReached ? 'Máx. Atingido' : 'Adicionar ao Pedido')}
                </Button>
            </div>
        </motion.div>
    );
}
