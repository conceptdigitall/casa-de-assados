import React from 'react';
import { AlertTriangle, Package, Check, Save } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function InventoryPage() {
    const { products, updateProductStock, updateProductMinStock } = useStore();

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem', color: '#111827' }}>Controle de Estoque</h1>

            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                        <tr>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#6b7280' }}>Produto</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#6b7280' }}>Estoque Atual</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#6b7280' }}>Estoque Mínimo</th>
                            <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            const isLowStock = product.stock <= product.minStock;
                            return (
                                <tr key={product.id} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: isLowStock ? '#fef2f2' : 'white' }}>
                                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img src={product.image} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                                        <span style={{ fontWeight: 500 }}>{product.name}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <input
                                                type="number"
                                                value={product.stock}
                                                onChange={(e) => updateProductStock(product.id, e.target.value)}
                                                style={{
                                                    width: '80px',
                                                    padding: '0.5rem',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '0.375rem',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <input
                                            type="number"
                                            value={product.minStock}
                                            onChange={(e) => updateProductMinStock(product.id, e.target.value)}
                                            style={{
                                                width: '80px',
                                                padding: '0.5rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '0.375rem'
                                            }}
                                        />
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        {isLowStock ? (
                                            <span style={{
                                                color: '#ef4444',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                fontWeight: 600,
                                                backgroundColor: '#fee2e2',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.875rem'
                                            }}>
                                                <AlertTriangle size={16} /> Repor
                                            </span>
                                        ) : (
                                            <span style={{
                                                color: '#10b981',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                fontWeight: 600,
                                                backgroundColor: '#d1fae5',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.875rem'
                                            }}>
                                                <Check size={16} /> OK
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', color: '#1e40af', fontSize: '0.875rem' }}>
                <p><strong>Dica:</strong> O estoque é atualizado automaticamente quando um pedido é realizado (pelo site ou pelo PDV).</p>
            </div>
        </div>
    );
}
