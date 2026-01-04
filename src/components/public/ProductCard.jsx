import React from 'react';
import Button from '../shared/Button';

export default function ProductCard({ product, onAdd }) {
    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ height: '200px', overflow: 'hidden' }}>
                <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{product.name}</h3>
                    <span style={{
                        color: 'var(--color-primary)',
                        fontWeight: 'bold',
                        fontSize: '1.25rem'
                    }}>
                        R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                </div>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', flex: 1 }}>
                    {product.description}
                </p>
                <Button
                    variant="primary"
                    onClick={() => product.stock > 0 && onAdd(product)}
                    style={{ width: '100%', justifyContent: 'center', opacity: product.stock > 0 ? 1 : 0.5, cursor: product.stock > 0 ? 'pointer' : 'not-allowed' }}
                >
                    {product.stock > 0 ? 'Adicionar ao Pedido' : 'Esgotado'}
                </Button>
            </div>
        </div>
    );
}
