import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Clock, MapPin, Phone, User, ShoppingBag, Truck, CheckCircle, XCircle } from 'lucide-react';
import Button from '../../components/shared/Button';

const getStatusColor = (status) => {
    switch (status) {
        case 'Pendente': return 'bg-red-100 text-red-800 border-red-200';
        case 'Em Preparo': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Rota de Entrega': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Entregue': return 'bg-green-100 text-green-800 border-green-200';
        case 'Pedido pronto para retirada': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'Pedido retirado': return 'bg-green-100 text-green-800 border-green-200';
        case 'Cancelado': return 'bg-gray-100 text-gray-800 border-gray-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getStatusLabel = (status) => {
    return status;
};

// ... imports

export default function OrdersPage() {
    const { orders, updateOrderStatus, couriers, deliveryFees, assignCourier } = useStore();

    // State for Courier Assignment Modal
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedCourierId, setSelectedCourierId] = useState('');
    const [selectedFeeId, setSelectedFeeId] = useState('');

    const handleNextStatus = (orderId, currentStatus) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        let nextStatus = currentStatus;

        if (order.type === 'pickup') {
            const pickupFlow = {
                'Pendente': 'Em Preparo',
                'Em Preparo': 'Pedido pronto para retirada',
                'Pedido pronto para retirada': 'Pedido retirado'
            };
            nextStatus = pickupFlow[currentStatus];
            if (nextStatus) updateOrderStatus(orderId, nextStatus);
        } else {
            // Delivery Flow
            if (currentStatus === 'Em Preparo') {
                // Moving to 'Rota de Entrega' -> Open Assignment Modal
                setSelectedOrderId(orderId);
                setIsAssignModalOpen(true);
                return;
            }

            const deliveryFlow = {
                'Pendente': 'Em Preparo',
                'Rota de Entrega': 'Entregue'
            };
            nextStatus = deliveryFlow[currentStatus];
            if (nextStatus) updateOrderStatus(orderId, nextStatus);
        }
    };

    const confirmAssignment = () => {
        if (!selectedCourierId || !selectedFeeId) {
            alert('Por favor, selecione um motoboy e uma taxa de entrega.');
            return;
        }

        const fee = deliveryFees.find(f => f.id === parseInt(selectedFeeId));
        const feeValue = fee ? fee.price : 0;
        const feeName = fee ? fee.name : '';

        assignCourier(selectedOrderId, parseInt(selectedCourierId), feeValue, feeName);
        updateOrderStatus(selectedOrderId, 'Rota de Entrega');

        // Reset and close
        setIsAssignModalOpen(false);
        setSelectedOrderId(null);
        setSelectedCourierId('');
        setSelectedFeeId('');
    };

    const handleCancel = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        // Restriction: Only 'Pendente' or 'Em Preparo' can be canceled
        if (order.status !== 'Pendente' && order.status !== 'Em Preparo') {
            alert('Este pedido já saiu para entrega ou foi finalizado e não pode ser cancelado.');
            return;
        }

        if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
            updateOrderStatus(orderId, 'Cancelado');
        }
    };

    // Sort orders by ID (newest first assuming ID increments) or Date if available
    const sortedOrders = [...orders].sort((a, b) => {
        // Extract number from "#123"
        const idA = parseInt(a.id.replace('#', '')) || 0;
        const idB = parseInt(b.id.replace('#', '')) || 0;
        return idB - idA;
    });

    return (
        <div>
            {/* Modal for Courier Assignment */}
            {isAssignModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
                }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', width: '90%', maxWidth: '400px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Atribuir Entrega</h2>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Motoboy</label>
                            <select
                                value={selectedCourierId}
                                onChange={(e) => setSelectedCourierId(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db' }}
                            >
                                <option value="">Selecione...</option>
                                {couriers.filter(c => c.active).map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Taxa de Entrega</label>
                            <select
                                value={selectedFeeId}
                                onChange={(e) => setSelectedFeeId(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db' }}
                            >
                                <option value="">Selecione...</option>
                                {deliveryFees.map(f => (
                                    <option key={f.id} value={f.id}>{f.name} - R$ {f.price.toFixed(2)}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setIsAssignModalOpen(false)} style={{ backgroundColor: '#9ca3af', color: 'white' }}>Cancelar</Button>
                            <Button variant="primary" onClick={confirmAssignment}>Confirmar e Enviar</Button>
                        </div>
                    </div>
                </div>
            )}

            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem', color: '#111827' }}>Gestão de Pedidos</h1>

            {sortedOrders.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>Nenhum pedido realizado ainda.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    {sortedOrders.map((order) => (
                        <div key={order.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '0.75rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            overflow: 'hidden',
                            border: '1px solid #e5e7eb',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            {/* Header */}
                            <div style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{order.id}</div>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`} style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    borderWidth: '1px',
                                    ...getStatusStyle(order.status) // Fallback for pure CSS if Tailwind not fully active
                                }}>
                                    {getStatusLabel(order.status)}
                                </span>
                            </div>

                            <div style={{ padding: '1.5rem', flex: 1 }}>
                                {/* Customer Info */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#374151', fontWeight: 600 }}>
                                        <User size={18} />
                                        {order.customer.name}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#4b5563', fontSize: '0.9rem' }}>
                                        <Phone size={16} />
                                        {order.customer.phone}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', color: '#4b5563', fontSize: '0.9rem' }}>
                                        <MapPin size={16} style={{ marginTop: '0.2rem' }} />
                                        <span style={{ flex: 1 }}>{order.customer.address}</span>
                                    </div>
                                </div>

                                {/* Items */}
                                <div style={{ marginBottom: '1.5rem', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem' }}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Itens do Pedido</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {order.items.map((item, idx) => (
                                            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                                                <span><span style={{ fontWeight: 'bold' }}>{item.quantity}x</span> {item.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {order.observation && (
                                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #d1d5db', fontSize: '0.875rem', color: '#dc2626' }}>
                                            <span style={{ fontWeight: 'bold' }}>Obs:</span> {order.observation}
                                        </div>
                                    )}
                                </div>

                                {/* Payment & Total */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pagamento ({order.payment.method === 'money' ? 'Dinheiro' : order.payment.method})</div>
                                        {order.payment.change > 0 && <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Troco p/ R$ {order.payment.change}</div>}
                                    </div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
                                        R$ {order.total.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {order.status !== 'Entregue' && order.status !== 'Pedido retirado' && order.status !== 'Cancelado' && order.status !== 'Finalizado' && (
                                <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.5rem' }}>
                                    <Button
                                        onClick={() => handleNextStatus(order.id, order.status)}
                                        style={{ flex: 1, justifyContent: 'center', backgroundColor: '#3b82f6', color: 'white' }}
                                    >
                                        Avançar Status
                                    </Button>
                                    <button
                                        onClick={() => handleCancel(order.id)}
                                        style={{
                                            padding: '0.5rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #ef4444',
                                            color: '#ef4444',
                                            backgroundColor: 'white',
                                            cursor: 'pointer'
                                        }}
                                        title="Cancelar Pedido"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Helper for inline styles since CSS classes might not be fully available/reliable for dynamic colors
function getStatusStyle(status) {
    switch (status) {
        case 'Pendente': return { backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' };
        case 'Em Preparo': return { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' };
        case 'Rota de Entrega': return { backgroundColor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe' };
        case 'Entregue': return { backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#a7f3d0' };
        case 'Pedido pronto para retirada': return { backgroundColor: '#e9d5ff', color: '#6b21a8', borderColor: '#d8b4fe' };
        case 'Pedido retirado': return { backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#a7f3d0' };
        case 'Cancelado': return { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' };
        default: return { backgroundColor: '#f3f4f6', color: '#1f2937', borderColor: '#e5e7eb' };
    }
}
