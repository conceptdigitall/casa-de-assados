import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/mockData';

const StoreContext = createContext();

export function useStore() {
    return useContext(StoreContext);
}

export function StoreProvider({ children }) {
    // Products with Stock
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('store_products');
        if (saved) return JSON.parse(saved);

        // Initialize stock if not present
        return initialProducts.map(p => ({
            ...p,
            stock: 20, // Default start stock
            minStock: 5
        }));
    });

    // Orders
    const [orders, setOrders] = useState(() => {
        return JSON.parse(localStorage.getItem('store_orders') || '[]');
    });

    useEffect(() => {
        localStorage.setItem('store_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('store_orders', JSON.stringify(orders));
    }, [orders]);

    // Actions
    const updateProductStock = (id, newStock) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, stock: parseInt(newStock) } : p
        ));
    };

    const updateProductMinStock = (id, newMin) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, minStock: parseInt(newMin) } : p
        ));
    };

    const addProduct = (productData) => {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = {
            ...productData,
            id: newId,
            stock: parseInt(productData.stock || 0),
            minStock: parseInt(productData.minStock || 5)
        };
        setProducts(prev => [...prev, newProduct]);
    };

    const updateProduct = (id, updatedData) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, ...updatedData } : p
        ));
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const addOrder = (orderData) => {
        // Calculate next ID based on existing orders
        const maxId = orders.reduce((max, order) => {
            const idNum = parseInt(order.id.replace('#', ''));
            return idNum > max ? idNum : max;
        }, 0);
        const nextId = maxId + 1;

        const newOrder = { ...orderData, id: `#${nextId}`, date: new Date().toISOString() };
        setOrders(prev => [newOrder, ...prev]);

        // 2. Decrement Stock
        setProducts(prev => prev.map(p => {
            const itemInOrder = orderData.items.find(i => i.id === p.id);
            if (itemInOrder) {
                return { ...p, stock: Math.max(0, p.stock - itemInOrder.quantity) };
            }
            return p;
        }));

        return newOrder;
    };

    const updateOrderStatus = (orderId, status) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status } : o
        ));
    };

    // Settings
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('store_settings');
        if (saved) return JSON.parse(saved);

        return {
            description: "O verdadeiro sabor do churrasco na sua mesa. Carnes selecionadas e preparadas com excelência para você e sua família.",
            contact: {
                phone: "(11) 99999-9999",
                instagram: "@casadosassados",
                address: "Av. Principal, 123 - Centro\nSão Paulo - SP"
            },
            hours: {
                weekdays: "11h às 15h / 18h às 23h",
                weekend: "11h às 23h"
            }
        };
    });

    useEffect(() => {
        localStorage.setItem('store_settings', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    // --- Courier Management ---
    const [couriers, setCouriers] = useState(() => {
        const saved = localStorage.getItem('store_couriers');
        return saved ? JSON.parse(saved) : [];
    });

    const [deliveryFees, setDeliveryFees] = useState(() => {
        const saved = localStorage.getItem('store_delivery_fees');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Bairro', price: 5 },
            { id: 2, name: 'Centro', price: 8 },
            { id: 3, name: 'Distante', price: 12 }
        ];
    });

    useEffect(() => {
        localStorage.setItem('store_couriers', JSON.stringify(couriers));
    }, [couriers]);

    useEffect(() => {
        localStorage.setItem('store_delivery_fees', JSON.stringify(deliveryFees));
    }, [deliveryFees]);

    const addCourier = (name) => {
        if (!name.trim()) return;
        const newCourier = { id: Date.now(), name, active: true };
        setCouriers(prev => [...prev, newCourier]);
    };

    const removeCourier = (id) => {
        setCouriers(prev => prev.filter(c => c.id !== id));
    };

    const addDeliveryFee = (name, price) => {
        const newFee = { id: Date.now(), name, price: parseFloat(price) };
        setDeliveryFees(prev => [...prev, newFee]);
    };

    const removeDeliveryFee = (id) => {
        setDeliveryFees(prev => prev.filter(f => f.id !== id));
    };

    const assignCourier = (orderId, courierId, feeValue, feeName) => {
        setOrders(prev => prev.map(o => {
            if (o.id === orderId) {
                return {
                    ...o,
                    courierId,
                    deliveryFee: parseFloat(feeValue) || 0, // Snapshot the fee at assignment time
                    deliveryZone: feeName || '' // Store the zone name
                };
            }
            return o;
        }));
    };

    return (
        <StoreContext.Provider value={{
            products,
            orders,
            settings,
            couriers,
            deliveryFees,
            updateProductStock,
            updateProductMinStock,
            addProduct,
            updateProduct,
            deleteProduct,
            addOrder,
            updateOrderStatus,
            updateSettings,
            addCourier,
            removeCourier,
            addDeliveryFee,
            removeDeliveryFee,
            assignCourier
        }}>
            {children}
        </StoreContext.Provider>
    );
}
