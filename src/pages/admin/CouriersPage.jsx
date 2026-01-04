import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';
import { Bike, Plus, Trash2, DollarSign, FileText } from 'lucide-react';

export default function CouriersPage() {
    const { couriers, deliveryFees, orders, addCourier, removeCourier, addDeliveryFee, removeDeliveryFee } = useStore();
    const [activeTab, setActiveTab] = useState('couriers'); // couriers, fees, report

    // Local state for forms
    const [newCourierName, setNewCourierName] = useState('');
    const [newFeeName, setNewFeeName] = useState('');
    const [newFeePrice, setNewFeePrice] = useState('');

    const handleAddCourier = (e) => {
        e.preventDefault();
        addCourier(newCourierName);
        setNewCourierName('');
    };

    const handleAddFee = (e) => {
        e.preventDefault();
        addDeliveryFee(newFeeName, newFeePrice);
        setNewFeeName('');
        setNewFeePrice('');
    };

    // Calculate Report Data
    const getReportData = () => {
        return couriers.map(courier => {
            const courierOrders = orders.filter(o => o.courierId === courier.id);
            const totalDeliveries = courierOrders.length;
            const totalEarnings = courierOrders.reduce((acc, o) => acc + (o.deliveryFee || 0), 0);

            // Collect unique zones
            const zones = [...new Set(courierOrders.map(o => o.deliveryZone).filter(Boolean))];

            return { ...courier, totalDeliveries, totalEarnings, zones };
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Bike size={32} color="#4b5563" />
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Gestão de Motoboys</h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                <button
                    onClick={() => setActiveTab('couriers')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        fontWeight: 600,
                        borderBottom: activeTab === 'couriers' ? '2px solid #3b82f6' : '2px solid transparent',
                        color: activeTab === 'couriers' ? '#3b82f6' : '#6b7280',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Motoboys
                </button>
                <button
                    onClick={() => setActiveTab('fees')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        fontWeight: 600,
                        borderBottom: activeTab === 'fees' ? '2px solid #3b82f6' : '2px solid transparent',
                        color: activeTab === 'fees' ? '#3b82f6' : '#6b7280',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Taxas de Entrega
                </button>
                <button
                    onClick={() => setActiveTab('report')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        fontWeight: 600,
                        borderBottom: activeTab === 'report' ? '2px solid #3b82f6' : '2px solid transparent',
                        color: activeTab === 'report' ? '#3b82f6' : '#6b7280',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Relatório
                </button>
            </div>

            {/* Content */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

                {/* 1. Motoboys Tab */}
                {activeTab === 'couriers' && (
                    <div>
                        <form onSubmit={handleAddCourier} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <input
                                type="text"
                                placeholder="Nome do Motoboy"
                                value={newCourierName}
                                onChange={(e) => setNewCourierName(e.target.value)}
                                style={{ flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                required
                            />
                            <Button variant="primary" type="submit">
                                <Plus size={20} style={{ marginRight: '0.5rem' }} /> Adicionar
                            </Button>
                        </form>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {couriers.map(courier => (
                                <div key={courier.id} style={{
                                    padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb'
                                }}>
                                    <span style={{ fontWeight: 600 }}>{courier.name}</span>
                                    <button
                                        onClick={() => removeCourier(courier.id)}
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {couriers.length === 0 && <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>Nenhum motoboy cadastrado.</p>}
                        </div>
                    </div>
                )}

                {/* 2. Fees Tab */}
                {activeTab === 'fees' && (
                    <div>
                        <form onSubmit={handleAddFee} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                placeholder="Local / Bairro"
                                value={newFeeName}
                                onChange={(e) => setNewFeeName(e.target.value)}
                                style={{ flex: 2, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                required
                            />
                            <div style={{ position: 'relative', flex: 1 }}>
                                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>R$</span>
                                <input
                                    type="number"
                                    placeholder="Valor"
                                    value={newFeePrice}
                                    onChange={(e) => setNewFeePrice(e.target.value)}
                                    step="0.50"
                                    style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                                    required
                                />
                            </div>
                            <Button variant="primary" type="submit">
                                <Plus size={20} style={{ marginRight: '0.5rem' }} /> Adicionar Taxa
                            </Button>
                        </form>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {deliveryFees.map(fee => (
                                <div key={fee.id} style={{
                                    padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb'
                                }}>
                                    <span style={{ fontWeight: 600 }}>{fee.name}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ color: '#059669', fontWeight: 'bold' }}>R$ {fee.price.toFixed(2)}</span>
                                        <button
                                            onClick={() => removeDeliveryFee(fee.id)}
                                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Report Tab */}
                {activeTab === 'report' && (
                    <div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#374151', width: '30%' }}>Motoboy</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#374151' }}>Locais de Entrega</th>
                                    <th style={{ textAlign: 'center', padding: '1rem', color: '#374151' }}>Entregas</th>
                                    <th style={{ textAlign: 'right', padding: '1rem', color: '#374151' }}>Total Ganho</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getReportData().map(data => (
                                    <tr key={data.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '1rem' }}>{data.name}</td>
                                        <td style={{ padding: '1rem' }}>
                                            {data.zones.length > 0 ? (
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                    {data.zones.map((zone, idx) => (
                                                        <span key={idx} style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '0.2rem 0.6rem', borderRadius: '0.25rem', fontSize: '0.8rem' }}>
                                                            {zone}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.9rem' }}>-</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span style={{ backgroundColor: '#e0e7ff', color: '#3730a3', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>
                                                {data.totalDeliveries}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: '#059669' }}>
                                            R$ {data.totalEarnings.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {couriers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Nenhum dado disponível.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
