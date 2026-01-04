import React, { useMemo } from 'react';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';
import AnalysisChart from '../../components/shared/AnalysisChart';
import { useStore } from '../../context/StoreContext';

const StatCard = ({ title, value, icon, trend }) => (
    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>{title}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.25rem', color: '#111827' }}>{value}</h3>
            </div>
            <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.5rem', borderRadius: '0.5rem' }}>
                {icon}
            </div>
        </div>
        {trend && (
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                <span style={{ color: '#10b981', fontWeight: 500 }}>{trend}</span>
                <span style={{ color: '#9ca3af', marginLeft: '0.5rem' }}>vs média anterior</span>
            </div>
        )}
    </div>
);

export default function AdminDashboard() {
    const { orders, products } = useStore();

    // --- Statistics Calculations ---
    const stats = useMemo(() => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let revenueToday = 0;
        let revenueMonth = 0;
        let revenueYear = 0;

        orders.forEach(order => {
            const orderDate = new Date(order.date);
            // Ensure date parsing is correct
            const orderDateStr = orderDate.toISOString().split('T')[0];

            if (orderDateStr === todayStr) {
                revenueToday += order.total;
            }
            if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
                revenueMonth += order.total;
            }
            if (orderDate.getFullYear() === currentYear) {
                revenueYear += order.total;
            }
        });

        // Keep active products count
        const activeProducts = products.filter(p => p.stock > 0).length;

        return {
            revenueToday,
            revenueMonth,
            revenueYear,
            activeInfo: `${activeProducts} / ${products.length}`
        };
    }, [orders, products]);

    // --- Charts Calculations ---

    // 1. Weekly Sales Chart
    const salesChartData = useMemo(() => {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d;
        });

        return last7Days.map(date => {
            const dayName = days[date.getDay()];
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

            // Sum revenue for this day
            const dailyRevenue = orders
                .filter(o => o.date.startsWith(dateStr))
                .reduce((acc, o) => acc + o.total, 0);

            return { name: dayName, value: dailyRevenue };
        });
    }, [orders]);

    // 2. Payment Methods Chart
    const paymentChartData = useMemo(() => {
        const counts = orders.reduce((acc, order) => {
            const method = order.payment.method === 'money' ? 'Dinheiro' :
                order.payment.method === 'credit' ? 'Crédito' :
                    order.payment.method === 'debit' ? 'Débito' :
                        order.payment.method === 'pix' ? 'Pix' : order.payment.method;
            acc[method] = (acc[method] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [orders]);

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem', color: '#111827' }}>Dashboard</h1>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard
                    title="Faturamento Hoje"
                    value={`R$ ${stats.revenueToday.toFixed(2).replace('.', ',')}`}
                    icon={<DollarSign size={20} />}
                />
                <StatCard
                    title="Faturamento Mês"
                    value={`R$ ${stats.revenueMonth.toFixed(2).replace('.', ',')}`}
                    icon={<DollarSign size={20} />}
                />
                <StatCard
                    title="Faturamento Ano"
                    value={`R$ ${stats.revenueYear.toFixed(2).replace('.', ',')}`}
                    icon={<DollarSign size={20} />}
                />
                <StatCard
                    title="Produtos Ativos"
                    value={stats.activeInfo}
                    icon={<Package size={20} />}
                />
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                <AnalysisChart data={salesChartData} title="Faturamento Diário (Últimos 7 dias)" type="area" />
                <AnalysisChart data={paymentChartData} title="Formas de Pagamento (Qtd)" type="bar" color="#F2A900" />
            </div>

            {orders.length === 0 && (
                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#eef2ff', borderRadius: '0.5rem', color: '#3730a3' }}>
                    <strong>Dica:</strong> Realize vendas no Site ou no PDV para ver os gráficos se moverem!
                </div>
            )}
        </div>
    );
}
